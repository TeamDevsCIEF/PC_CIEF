const invertirString=(inString="")=>{
    const obj={
        length:inString.length,
        stringInvertido:""}
    for(i in inString){
        obj.stringInvertido+=inString.slice(obj.length-1,obj.length).toLocaleLowerCase();
        --obj.length}
    return obj.stringInvertido
}

const palindronosF=(inString="")=>{return inString.toLowerCase() === invertirString(inString).toLowerCase();}

const cantidadLetrasStringF=(inString="")=>{
    outString={}

    for(let i of inString.toLocaleLowerCase()){
        if(i in outString)
            { outString[i]++;}
        else
            {outString[i]=1;}}
    return outString;
}
const obj={
    inputStringInvertir:document.querySelector("#inputStringInvertir"),
    stringInvertido:document.querySelector("#stringInvertido"),
    palindronos:document.querySelector("#palindronos"),cantidadLetrasString:document.querySelector("#cantidadLetrasString")}


const runAll=()=>{
    
    let inString=obj.inputStringInvertir.value.trim();
    

    if(inString){
        obj.stringInvertido.innerHTML=`<span style="color:green">${invertirString(inString)}</span>`;
        if(palindronosF(inString)) {obj.palindronos.innerHTML=`${inString} es un <span style="color:green">Palindromo</span>`}
        else{obj.palindronos.innerHTML=`${inString} <span style="color:red">NO ES</span> Palindromo`}
        let varCantidadLetrasStringF=cantidadLetrasStringF(inString)
        obj.cantidadLetrasString.innerHTML="";
        for(let i in varCantidadLetrasStringF) {obj.cantidadLetrasString.innerHTML+=`<li>Tenemos ${varCantidadLetrasStringF[i]} letras ${i}</li>`}}
}

obj.inputStringInvertir.addEventListener("input",runAll);