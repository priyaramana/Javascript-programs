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
let editedRow = null

borrrowerbtn.addEventListener("click",()=>{
    addForm.style.display = "block"
    repaidAmount.disabled = false
    pendingAmount.disabled = false
})

closeForm.addEventListener("click",()=>{
    addForm.style.display = "none"
})
saveForm.addEventListener("click",()=>{
    const BorrowerName = personName.value
    const AmountLent = amountLent.value
    const frequency = repaymentFrequency.value
    const duration = repaymentduration.value
    const repaid = repaidAmount.value
    const pending = pendingAmount.value

    repaidAmount.disabled = false
    pendingAmount.disabled = false

    console.log(BorrowerName)
    let tableRow = document.createElement("tr")
    let tableCell1 = document.createElement("td")
    tableCell1.textContent = BorrowerName
    tableRow.appendChild(tableCell1)

    let tableCell2 = document.createElement("td")
    tableCell2.textContent = AmountLent
    tableRow.appendChild(tableCell2)
  

    let tableCell3 = document.createElement("td")
    tableCell3.textContent = frequency
    tableRow.appendChild(tableCell3)

    let tableCell4 = document.createElement("td")
    tableCell4.textContent = duration
    tableRow.appendChild(tableCell4)

    let tableCell5 = document.createElement("td")
    tableCell5.textContent = repaid
    tableRow.appendChild(tableCell5)

    let tableCell6 = document.createElement("td")
    tableCell6.textContent = pending
    tableRow.appendChild(tableCell6)

    let tableCell7 = document.createElement("td")
    let Delete = document.createElement("button")
    Delete.textContent = "Delete"
    let Edit = document.createElement("button")
    Edit.textContent = "Edit"
    let AddRepayment = document.createElement("button")
    AddRepayment.textContent = "AddRepayment"
    tableCell7.appendChild(Delete)
    tableCell7.appendChild(Edit)
    tableCell7.appendChild(AddRepayment)
    tableRow.appendChild(tableCell7)
    console.log("Edited row:", editedRow)
    if (editedRow === null) {
       borrowerTable.appendChild(tableRow)
    }else{
        
    editedRow.cells[0].textContent = BorrowerName
    editedRow.cells[1].textContent = AmountLent
    editedRow.cells[2].textContent = frequency
    editedRow.cells[3].textContent = duration
    editedRow.cells[4].textContent = repaid
    editedRow.cells[5].textContent = pending

    editedRow = null
    }
    
    

    Delete.addEventListener("click",(event)=>{
    event.target.closest("tr").remove()
    updateDashboard()
    })

    Edit.addEventListener("click",(event)=>{
        
        addForm.style.display = "block"
        let row1 = event.target.closest("tr")
        editedRow = row1
        let Editedname = row1.cells[0].textContent
        let EditedlentAmt = row1.cells[1].textContent
        let Editedfreq = row1.cells[2].textContent
        let Editeddurtn = row1.cells[3].textContent
        let Editedrepaid = row1.cells[4].textContent
        let Editedpending = row1.cells[5].textContent
        
        personName.value = Editedname
        amountLent.value = EditedlentAmt
        repaymentFrequency.value = Editedfreq
        repaymentduration.value = Editeddurtn
        repaidAmount.value = Editedrepaid
        pendingAmount.value = Editedpending
        repaidAmount.disabled = true
        pendingAmount.disabled = true
    })
    AddRepayment.addEventListener("click",(event)=>{
        let repaymentRow = event.target.closest("tr")
        let repayamt = prompt("Enter repayment amount : ")
        let currentAmt = repaymentRow.cells[4].textContent
        let pendingAmt = repaymentRow.cells[5].textContent
        let repaymentNumber = Number(repayamt)
        let currentAmtNumber = Number(currentAmt)
        let pendingAmtNumber = Number(pendingAmt)
        let newRepaidAmount = currentAmtNumber + repaymentNumber
        let newPendingAmount = pendingAmtNumber - repaymentNumber
        repaymentRow.cells[4].textContent = newRepaidAmount
        repaymentRow.cells[5].textContent = newPendingAmount
        updateDashboard()

    })
    updateDashboard()

    //closes the form
    addForm.style.display = "none"
    personName.value = ""
    amountLent.value = ""
    repaymentFrequency.value = ""
    repaymentduration.value = ""
    repaidAmount.value = ""
    pendingAmount.value = ""

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
