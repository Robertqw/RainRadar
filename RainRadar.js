//var ma,mb,offset=0;
//var m;

var offset=0;
var rangeTxt="120K";
var numPics=20;
var timeStr=[];
var count=0;
var delay=3;

//document.getElementById("ScrollPic").max=numPics;
/*function test(){
	document.getElementById("ScrollPic").max=numPics;
}*/

function updateMark(){
	var a=document.getElementById("toggleMark").checked;
	document.getElementById("mark").className=(rangeTxt==="120K")?"marker hamilton120":"marker hamilton300";
	document.getElementById("mark").style=(a===false)?"display: none;":"display: block;";
	console.log("toggleMark="+a+", mark.class="+document.getElementById("mark").class);
}


function nextPic(selPic){
	if(timeStr[0]===undefined){
		main();
		count=0;
	} // prepare timeStr[] with main()if haven't done so; reset count
	if(selPic!=undefined){
		count=selPic;
		} else{
		document.getElementById("ScrollPic").value=count+1; //update scroll bar
	}
	var a=document.getElementById("img");
	a.src= "https://www.metservice.com/publicData/rainRadar/image/Bay-of-Plenty/"+rangeTxt+"/"+timeStr[timeStr.length-1-count];
	document.getElementById("p1").innerHTML="Time: " + timeStr[timeStr.length-1-count];
	console.log("timeStr["+(timeStr.length-1-count)+"]="+timeStr[timeStr.length-1-count]);
	count=(count<timeStr.length-1)?1+count:0;
}

function updateByScroll(){
	var picIndex=document.getElementById("ScrollPic").value;
	nextPic(picIndex-1);
}

function updateRange(){
	main(); //prepare timeStr[] with new range setting
	updateByScroll();
	updateMark();
}

function main(){
	var a=new Date();
	var t=a.getTime()-delay*60*1000;//Add in delay
	a=new Date(t);//Add in delay
	var m=a.getMinutes();
	
	//var url= /*"https://www.metservice.com/publicData/rainRadar/image/Bay-of-Plenty/120K/"*/ "Current time =" +y+"-"+mo+"-"+d+"T"+h+":"+m+":00+12:00"
	
	var rangeObj=document.getElementById("range");
	console.log("range="+rangeObj.selectedIndex+", rangeTxt="+rangeTxt);
	if(rangeObj.selectedIndex===0){
		offset=9;
		rangeTxt="300K";
		} else{
		offset=0;
		rangeTxt="120K";
	}
	
	var dmSecSlot=[];
	dmSecSlot=findMinSlot(m,offset);//returns: 1, the difference between minute slot and actual minute; 2, the position of the minute slot (i.e. 7 minute slot or 8 minute slot). 
	
	console.log("  a="+a+",   t="+t+", dmSec="+dmSecSlot[0]+", slot="+dmSecSlot[1]);
	nt=t-dmSecSlot[0];
	var na=new Date(nt);
	var ny=na.getFullYear();
	var nmo=na.getMonth();
	var nd=na.getDate();
	var nh=na.getHours();
var nm=na.getMinutes();

na=new Date(ny,nmo,nd,nh,nm);
var nt=na.getTime();

for (let i=0;i<numPics;i++){
timeStr[i]=constTimeString(nt);
//console.log("timeStr["+i+"]="+timeStr[i]);
nt-=(dmSecSlot[1]==1)?7*60*1000:8*60*1000;
dmSecSlot[1]=!dmSecSlot[1];
}

console.log("na="+na+", nt="+nt+", dmSec="+dmSecSlot[0]);
//console.log(url);
}

function constTimeString(t){
var a=new Date(t);
var y=a.getFullYear();
var mo=a.getMonth()+1;
var d=a.getDate();
var h=a.getHours();
var m=a.getMinutes();
var str=y+"-"+addZero(mo)+"-"+addZero(d)+"T"+addZero(h)+":"+addZero(m)+":00+12:00";
//console.log("constTimeString()-mo="+mo);
return str;
}

function findMinSlot(m,offset){
offset=(offset===undefined)?0:offset;
var mb=(m+offset-(m+offset)%15)/15;
var ma=((m+offset-mb*15)%15>=7)?1:0;
var min=(ma?7:0)+mb*15-offset;
console.log("m="+m+", mb="+mb+", ma="+ma+", min="+min+", offset="+offset);
//min[1]=(min[0]>m)?1:0;//if min[0]>m then hour should -1
var dMiliSec=1000*60*(m-min);
console.log("dMiliSec="+dMiliSec+", ma="+ma);
return [dMiliSec,ma]; 
}

function addZero(i){
i=(i.toString().length<2)?"0"+i:i;
return i;
}
