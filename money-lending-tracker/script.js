const SUPABASE_URL = "https://reemyiczlyqwenbzzcbe.supabase.co"
const SUPABASE_KEY = "sb_publishable_Kbw5ps7GE_EljyhIrVjy0w_BmBLj7Lo"

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
)
const urlParams = new URLSearchParams(window.location.hash.substring(1))

if (urlParams.get("type") === "recovery") {
    document.getElementById("loginForm").style.display = "none"
    resetPasswordForm.style.display = "block"
}
supabaseClient.auth.getSession().then(({ data, error }) => {
    if (error) {
        console.error("Session error:", error.message)
        return
    }

    if (data.session) {
        currentUserId = data.session.user.id
        console.log("Existing session:", currentUserId)
    }
})

const email = document.getElementById("email")
const password = document.getElementById("pwd")
const loginBtn = document.getElementById("loginBtn")
const borrrowerbtn = document.getElementById("addBorrowerbtn")
const addForm = document.getElementById("AddBorrowerForm")
const closeForm = document.getElementById("closeBorrowerForm")
const saveForm = document.getElementById("saveBorrower")
const personName = document.getElementById("PersonName")
const borrowerTable = document.getElementById("borrowerTableBody")
const amountLent = document.getElementById("LentAmount")
const repaymentFrequency = document.getElementById("RepaymentFrequency")
const repaymentduration = document.getElementById("Duration")
const repaidAmount = document.getElementById("RepaidAmount")
const pendingAmount = document.getElementById("PendingAmount")
const totalLendingamt = document.getElementById("totlenamt")
const totalRecevd = document.getElementById("totrecvd")
const totalPending = document.getElementById("totpendng")
const totalBorrowed = document.getElementById("totborrwrs")
const resetPasswordForm = document.getElementById("resetPasswordForm")
const newPassword = document.getElementById("newPassword")
const confirmPassword = document.getElementById("confirmPassword")
const updatePasswordBtn = document.getElementById("updatePasswordBtn")
let editedRow = null
let editedBorrowerId = null
let currentUserId = null


loginBtn.addEventListener("click", async () => {
    console.log("Email entered:", email.value.trim())
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email.value.trim(),
        password: password.value
    })

    if (error) {
        alert("Login failed: " + error.message)
        return
    }

    console.log("Login successful:", data.user)
    alert("Login successful!")
    currentUserId = data.user.id
    await loadBorrowers()
    console.log("Logged-in User ID:", currentUserId)
})

updatePasswordBtn.addEventListener("click", async () => {
    const { data, error } = await supabaseClient.auth.updateUser({
        password: newPassword.value
    })

    if (error) {
        alert("Password update failed: " + error.message)
        return
    }

    alert("Password updated successfully!")
    resetPasswordForm.style.display = "none"
})

borrrowerbtn.addEventListener("click",()=>{
    addForm.style.display = "block"
    repaidAmount.disabled = false
    pendingAmount.disabled = false

    addForm.style.display = "none"
    personName.value = ""
    amountLent.value = ""
    repaymentFrequency.value = ""
    repaymentduration.value = ""
    repaidAmount.value = ""
    pendingAmount.value = ""
})

closeForm.addEventListener("click",()=>{
    addForm.style.display = "none"
})
saveForm.addEventListener("click",async ()=>{
    const BorrowerName = personName.value
    const AmountLent = amountLent.value
    const frequency = repaymentFrequency.value
    const duration = repaymentduration.value
    const repaid = repaidAmount.value
    const pending = pendingAmount.value

    if (!currentUserId) {
    alert("Please login first")
    return
    }

    let result

if (editedBorrowerId === null) {
    result = await supabaseClient
        .from("borrowers")
        .insert([{
            person_name: BorrowerName,
            amount_lent: AmountLent,
            repayment_frequency: frequency,
            duration: duration,
            amount_repaid: repaid,
            pending_amount: pending,
            user_id: currentUserId
        }])
} else {
    result = await supabaseClient
        .from("borrowers")
        .update({
            person_name: BorrowerName,
            amount_lent: AmountLent,
            repayment_frequency: frequency,
            duration: duration
        })
        .eq("id", editedBorrowerId)
        .eq("user_id", currentUserId)
}

if (result.error) {
    console.error("Error saving borrower:", result.error.message)
    alert("Failed to save borrower: " + result.error.message)
    return
}
    await loadBorrowers()

    editedRow = null
    editedBorrowerId = null

    repaidAmount.disabled = false
    pendingAmount.disabled = false
    })

function updateDashboard(){

    let borrowerList = borrowerTable.querySelectorAll("tr")
    let totalLentAmount = 0
    for(let i=0;i<borrowerList.length;i++){
        let amt = Number(borrowerList[i].cells[1].textContent)
        totalLentAmount +=amt
    }
    totalLendingamt.textContent = totalLentAmount

    let totalReceivedAmount = 0
     for(let i=0;i<borrowerList.length;i++){
        let amt = Number(borrowerList[i].cells[4].textContent)
        totalReceivedAmount +=amt
    }
    totalRecevd.textContent = totalReceivedAmount

    let totalPendingAmount = 0
    for(let i=0;i<borrowerList.length;i++){
        let amt = Number(borrowerList[i].cells[5].textContent)
        totalPendingAmount +=amt
    }
    totalPending.textContent = totalPendingAmount

    totalBorrowed.textContent = borrowerList.length
}

async function loadBorrowers() {
    const { data, error } = await supabaseClient
    .from("borrowers")
    .select("*")
    .eq("user_id", currentUserId)

    if (error) {
    console.error("Error loading borrowers:", error.message)
    return
}

console.log("Borrowers fetched:", data)
borrowerTable.innerHTML = ""

data.forEach((borrower) => {
    const row = document.createElement("tr")
    row.dataset.id = borrower.id
    console.log("Loaded borrower ID:", row.dataset.id)

const values = [
    borrower.person_name,
    borrower.amount_lent,
    borrower.repayment_frequency,
    borrower.duration,
    borrower.amount_repaid,
    borrower.pending_amount
]

values.forEach((value) => {
    const cell = document.createElement("td")
    cell.textContent = value
    row.appendChild(cell)
})

const actionCell = document.createElement("td")
const Delete = document.createElement("button")
Delete.textContent = "Delete"

const Edit = document.createElement("button")
Edit.textContent = "Edit"

const AddRepayment = document.createElement("button")
AddRepayment.textContent = "Add Repayment"
actionCell.appendChild(Delete)
actionCell.appendChild(Edit)
actionCell.appendChild(AddRepayment)
Delete.addEventListener("click", async(event)=>{
    const row = event.target.closest("tr")
    const borrowerId = row.dataset.id
    const { error } = await supabaseClient
    .from("borrowers")
    .delete()
    .eq("id", borrowerId)
    .eq("user_id", currentUserId)
    if (error) {
        console.error("Error deleting borrower:", error.message)
        alert("Failed to delete borrower")
        return
    }

    row.remove()
    updateDashboard()
    })

Edit.addEventListener("click", (event) => {
    addForm.style.display = "block"

    const row1 = event.target.closest("tr")
    editedRow = row1
    editedBorrowerId = row1.dataset.id

    personName.value = row1.cells[0].textContent
    amountLent.value = row1.cells[1].textContent
    repaymentFrequency.value = row1.cells[2].textContent
    repaymentduration.value = row1.cells[3].textContent

    repaidAmount.value = row1.cells[4].textContent
    pendingAmount.value = row1.cells[5].textContent

    repaidAmount.disabled = true
    pendingAmount.disabled = true
})    
AddRepayment.addEventListener("click", async (event) => {
    const repaymentRow = event.target.closest("tr")
    const borrowerId = repaymentRow.dataset.id

    const repayamt = prompt("Enter repayment amount:")
    const repaymentNumber = Number(repayamt)

    const currentAmtNumber = Number(repaymentRow.cells[4].textContent)
    const pendingAmtNumber = Number(repaymentRow.cells[5].textContent)

    const newRepaidAmount = currentAmtNumber + repaymentNumber
    const newPendingAmount = pendingAmtNumber - repaymentNumber

    const { error } = await supabaseClient
        .from("borrowers")
        .update({
            amount_repaid: newRepaidAmount,
            pending_amount: newPendingAmount
        })
        .eq("id", borrowerId)
        .eq("user_id", currentUserId)

    if (error) {
        console.error("Error updating repayment:", error.message)
        alert("Failed to save repayment")
        return
    }

    repaymentRow.cells[4].textContent = newRepaidAmount
    repaymentRow.cells[5].textContent = newPendingAmount

    updateDashboard()
})
row.appendChild(actionCell)

borrowerTable.appendChild(row)
})
updateDashboard()
}
console.log(supabaseClient)
