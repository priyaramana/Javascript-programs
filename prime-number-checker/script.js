const input = document.getElementById("primeNumber-input");
const check = document.getElementById("check");
const clear = document.getElementById("clear");
const result = document.getElementById("result");
check.addEventListener("click", () => {
  let number = input.value;
  if (number === ""){
    result.textContent = "Empty value"
    return;
  }
number = Number(number)
  if (Number.isNaN(number)){
    result.textContent = "Enter valid value"
    return;
  }
result.textContent = "prime"
if(number <= 1 ){
  result.textContent = "Not prime"
}
for(let i=2;i<=number-1;i++){
  if(number%i === 0){
    result.textContent = "Not prime"
    break;
  }
}
  
});
clear.addEventListener("click", () => {
  input.value=""
  result.textContent=""
});
