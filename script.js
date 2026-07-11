// ================================
// NOVACALC SCIENTIFIC CALCULATOR
// ================================


let expression = "0";

let historyData =
JSON.parse(localStorage.getItem("calcHistory")) || [];


let memory = 0;


let angleMode =
localStorage.getItem("angleMode") || "DEG";



const result =
document.getElementById("result");


const historyText =
document.getElementById("history");


const historyList =
document.getElementById("historyList");


const toast =
document.getElementById("toast");





// ================================
// DISPLAY
// ================================


function updateDisplay(){

    result.innerText = expression;

}



function showToast(message){

    toast.innerText = message;

    toast.classList.add("show");


    setTimeout(()=>{

        toast.classList.remove("show");

    },1500);

}




// ================================
// INPUT
// ================================

function insert(value){

    if(value === "%"){

        try{

            let num = evaluate(expression);

            expression = String(num / 100);

        }
        catch{

            error();
            return;

        }

        updateDisplay();
        return;
    }


    if(expression === "0"){

        expression = value;

    }
    else{

        expression += value;

    }


    updateDisplay();

}



    



function clearAll(){

    expression="0";

    historyText.innerText="";

    updateDisplay();

}




function deleteLast(){


    expression =
    expression.slice(0,-1);


    if(expression===""){

        expression="0";

    }


    updateDisplay();


}







// ================================
// CONSTANTS
// ================================


function insertConstant(type){


    if(type==="PI"){

        insert(Math.PI.toString());

    }


    if(type==="E"){

        insert(Math.E.toString());

    }


}







// ================================
// SCIENTIFIC
// ================================


function scientific(type){


try{


let value =
evaluate(expression);



let answer;



switch(type){


case "sin":

answer =
Math.sin(convertAngle(value));

break;



case "cos":

answer =
Math.cos(convertAngle(value));

break;



case "tan":

answer =
Math.tan(convertAngle(value));

break;



case "log":

answer =
Math.log10(value);

break;



case "ln":

answer =
Math.log(value);

break;



case "sqrt":

answer =
Math.sqrt(value);

break;



case "square":

answer =
value * value;

break;



}



saveHistory(expression,answer);



expression =
format(answer);


updateDisplay();



}

catch{

error();

}


}






// ================================
// CALCULATE
// ================================



function calculate(){


try{


let answer =
evaluate(expression);



saveHistory(expression,answer);



expression =
format(answer);



updateDisplay();



}


catch{

error();

}



}






// ================================
// SAFE EVALUATION
// ================================


function evaluate(exp){


exp =
exp.replaceAll("^","**");



if(
exp.includes("++") ||
exp.includes("--") ||
exp.includes("..")
){

throw "Invalid";

}



return Function(
'"use strict";return ('+
exp+
')'
)();



}





// ================================
// DEG / RAD
// ================================


function convertAngle(value){


if(angleMode==="DEG"){

return value*Math.PI/180;

}


return value;


}





document
.getElementById("degreeBtn")
.onclick=()=>{


angleMode="DEG";


localStorage.setItem(
"angleMode",
"DEG"
);


showToast("Degree Mode");


};





document
.getElementById("radianBtn")
.onclick=()=>{


angleMode="RAD";


localStorage.setItem(
"angleMode",
"RAD"
);


showToast("Radian Mode");


};







// ================================
// SIGN CHANGE
// ================================


function changeSign(){


try{


expression =
String(
evaluate(expression)*-1
);


updateDisplay();


}

catch{

error();

}



}





// ================================
// MEMORY
// ================================


function memoryClear(){

memory=0;

showToast("Memory Cleared");

}




function memoryRecall(){

insert(memory.toString());

}




function memoryAdd(){

memory += evaluate(expression);

showToast("Added");

}




function memorySubtract(){

memory -= evaluate(expression);

showToast("Removed");

}







// ================================
// HISTORY
// ================================


function saveHistory(exp,result){


historyData.unshift({

exp,

result,

time:new Date()
.toLocaleTimeString()

});


if(historyData.length>30){

historyData.pop();

}



localStorage.setItem(
"calcHistory",
JSON.stringify(historyData)
);



renderHistory();


}




function renderHistory(){


historyList.innerHTML="";


historyData.forEach(item=>{


let div =
document.createElement("div");


div.innerHTML =
`
${item.exp}
<br>
=
<b>${item.result}</b>
`;



historyList.appendChild(div);



});



}





function clearHistory(){


historyData=[];


localStorage.removeItem(
"calcHistory"
);



renderHistory();


}








// ================================
// COPY
// ================================


function copyResult(){


navigator.clipboard.writeText(
expression
);


showToast("Copied");


}







// ================================
// ERROR
// ================================


function error(){


expression="Error";


updateDisplay();



setTimeout(()=>{

expression="0";

updateDisplay();


},1200);


}






// ================================
// FORMAT NUMBER
// ================================


function format(num){


if(
Number.isInteger(num)
){

return num.toString();

}



return Number(
num.toFixed(10)
).toString();


}







// ================================
// THEME
// ================================


const themeBtn =
document.getElementById("themeBtn");



if(
localStorage.getItem("theme")
==="dark"
){

document.body.classList.add("dark");

}




themeBtn.onclick=()=>{


document.body.classList.toggle("dark");



let mode =
document.body.classList.contains("dark")
?
"dark"
:
"light";



localStorage.setItem(
"theme",
mode
);



};







// ================================
// KEYBOARD
// ================================


document.addEventListener(
"keydown",
(e)=>{


let key=e.key;



if(
key>="0" &&
key<="9"
){

insert(key);

}



else if(
["+","-","*","/","."].includes(key)
){

insert(key);

}



else if(key==="Enter"){

calculate();

}



else if(key==="Backspace"){

deleteLast();

}



else if(key==="Escape"){

clearAll();

}



}
);







// INITIAL LOAD

renderHistory();

updateDisplay();
