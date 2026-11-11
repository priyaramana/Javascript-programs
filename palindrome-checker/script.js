const input = document.getElementById("palindrome-input");
const check = document.getElementById("check");
const clear = document.getElementById("clear");
const result = document.getElementById("result");
check.addEventListener("click", () => {
  let word = input.value;
  word = word.toLowerCase().replace(/[^a-zA-Z0-9]/g, "");
  let char = word.split('')
let reverse = ""
for(let i=char.length-1;i>=0;i--){
  reverse += char[i]
}
if(word === reverse){
  result.textContent="Palindrome"
}else{
  result.textContent="Not a palindrome"
}
});
clear.addEventListener("click", () => {
  input.value=""
  result.textContent=""
});
