const leftlane = document.getElementById('left');
const downlane = document.getElementById('down');
const uplane = document.getElementById('up');
const rightlane = document.getElementById('right');

var vocals = document.getElementById("TSongV");
var inst = document.getElementById("TSongI");

let score=0;
let miss=0;
let Hits=0;
let Health=50;
let combo=0;
let heat=0;// previous was 1
let HTMeter= 0;
let HIcombo =0;
let Corrupt=0;
let CorruptM=0;
let Good=0;
let Perfect=0;
let opacity=100;
let HPGain=1;
let HTGain=1;
let HTDrain=1;
let HPDrain=1;
let IceG=1;
let chart ='Songs/tutorial.json';
debounce = [false,false,false,false]

function modifiers(){
    HTGain = document.getElementById("HeatGain").value;
    document.getElementById("HTGShow").innerHTML = `Heat gain: ${HTGain}x`;
    HTDrain = document.getElementById("HeatDrain").value;
    document.getElementById("HTDShow").innerHTML = `Heat drain: ${HTDrain}x`;
    HPGain = document.getElementById("HealthGain").value;
    document.getElementById("HPGShow").innerHTML = `Health regen: ${HPGain}x`;
    HPDrain = document.getElementById("HealthDrain").value;
    document.getElementById("HPDShow").innerHTML = `Health drain: ${HPDrain}x`;
    IceG = document.getElementById("IceGain").value;
    document.getElementById("IGShow").innerHTML = `Ice gain: ${IceG}x`;
}
function healing(){
    opacity-=20;
    if(Corrupt >= 21){
        Health+=0;
        document.getElementById("PlayerHP").style.width= `${Health}%`;
    }else {
        Health+=(0.5/(Corrupt+1))*HPGain;
        if(Health > 100){
            Health=100;
        }
        document.getElementById("PlayerHP").style.width= `${Health}%`;
    }
    if (opacity<=0){
         document.getElementById("ratinghit").src = 'nothing.png';
    }
    if(document.getElementById("PassiveIceMelt").checked == true) {
        Corrupt-=0.01*heat;
        if(Corrupt <= 0){
            Corrupt=0;
        }
        CorruptM= 210 - (Corrupt*10);
        document.getElementById("Corrupt").style.height= `${CorruptM}px`;
    }
}

function MissNote(){
                score -=Math.round(((100*(combo+1))*(Corrupt+1)/-((heat*3)-2))); // old ((100*(combo+1))/((heat*3)-2)+((100*miss)*0.5))
                miss+=1;
                opacity=100;
                Health-=(7-heat/5)*HPDrain;
                heat-=10*HTDrain;
                Corrupt+=1*IceG;
                if(combo>=HIcombo){
                HIcombo=combo;
                }
                combo=0;
                if(heat < -1){
                    heat=0;
                }
                HTMeter = 300 - (heat*10);
                if(HTMeter > 300){
                    HTMeter=300; 
                }
                if(Health<0){
                    Health=0;
                    Corrupt=21;
                    gameon=false;
                }
                if(Corrupt >= 22){
                    Corrupt=21;
                }
                CorruptM= 210 - (Corrupt*10);
                document.getElementById("Corrupt").style.height= `${CorruptM}px`;
                document.getElementById("HIcombo").innerHTML=`Highest Combo: ${HIcombo}`;
                document.getElementById("misses").innerHTML=`Misses: ${miss}`;
                document.getElementById("Heat").style.height= `${HTMeter}px`;
                document.getElementById("PlayerHP").style.width= `${Health}%`;
                document.getElementById("hit").innerHTML=`Hits: ${Hits}`;
                document.getElementById("Goods").innerHTML=`Goods: ${Good}`;
                document.getElementById("Perfects").innerHTML=`Perfects: ${Perfect}`;
                document.getElementById("ok").innerHTML=`Score: ${score}`;
                document.getElementById("combo").innerHTML=`Combo: ${combo}`;
                vocals.volume = 0;      
                document.getElementById("ratinghit").src = 'Rating/miss.png';
                
}
function hit(){
            combo +=1;
            score +=Math.round(10+(heat*combo));
            heat +=0.2*HTDrain;
            Hits +=1;
            Good+=1;
            opacity=100;
            //Health +=5;
            if(heat>=31){
                heat=30;
            }
            HTMeter = 300 - (heat*10);
            if (HTMeter < 0){
                HTMeter=0;
            }
            if(Health > 100){
                Health=100;
            }
            if(combo>=HIcombo){
            HIcombo=combo;
            }
            if(heat==30){
                Corrupt=0;
            }
            CorruptM= 210 - (Corrupt*10);
            document.getElementById("Corrupt").style.height= `${CorruptM}px`;
            document.getElementById("HIcombo").innerHTML=`Highest Combo: ${HIcombo}`;
            document.getElementById("Heat").style.height= `${HTMeter}px`;
            document.getElementById("PlayerHP").style.width= `${Health}%`;
            document.getElementById("hit").innerHTML=`Hits: ${Hits}`;
            document.getElementById("Goods").innerHTML=`Goods: ${Good}`;
            document.getElementById("Perfects").innerHTML=`Perfects: ${Perfect}`;
            document.getElementById("ok").innerHTML=`Score: ${score}`;
            document.getElementById("combo").innerHTML=`Combo: ${combo}`;
            vocals.volume = 1;
            document.getElementById("ratinghit").src = 'Rating/fun.png';
}
function hitperfect(){
            combo +=1;
            score +=Math.round(10+(heat*combo));
            heat +=1*HTGain;
            Hits +=1;
            Perfect+=1;
            opacity=100;
            //Health +=5;
            if(heat>=31){
                heat=30;
            }
            HTMeter = 300 - (heat*10);
            if (HTMeter < 0){
                HTMeter=0;
            }
            if(Health > 100){
                Health=100;
            }
            if(combo>=HIcombo){
            HIcombo=combo;
            }
            if(heat==30){
                Corrupt=0;
            }
            CorruptM= 210 - (Corrupt*10);
            document.getElementById("Corrupt").style.height= `${CorruptM}px`;
            document.getElementById("HIcombo").innerHTML=`Highest Combo: ${HIcombo}`;
            document.getElementById("Heat").style.height= `${HTMeter}px`;
            document.getElementById("PlayerHP").style.width= `${Health}%`;
            document.getElementById("hit").innerHTML=`Hits: ${Hits}`;
            document.getElementById("Goods").innerHTML=`Goods: ${Good}`;
            document.getElementById("Perfects").innerHTML=`Perfects: ${Perfect}`;
            document.getElementById("ok").innerHTML=`Score: ${score}`;
            document.getElementById("combo").innerHTML=`Combo: ${combo}`;
            vocals.volume = 1;
            document.getElementById("ratinghit").src = 'Rating/perfect.png';
}

document.addEventListener('keydown', function (event) {
    if (event.key == "d") {
        if (debounce[0]) {return}
        debounce[0] = true;
        let closestArr = [0,0];
        let setTemp = false;
        for(let arrowMassIndex = 0; arrowMassIndex < arrows.length; arrowMassIndex+=1){
            if (arrows[arrowMassIndex][2] == 0) {
                // console.log(arrows[arrowMassIndex][1] > 400, closestArr[1] < arrows[arrowMassIndex][1]);
                if (arrows[arrowMassIndex][1] > 440 && closestArr[1] < arrows[arrowMassIndex][1]){//perfect hit
                    closestArr[0] = arrowMassIndex;
                    closestArr[1] = arrows[arrowMassIndex][1];
                    setTemp = true;
                    hitperfect();
                }else if (arrows[arrowMassIndex][1] > 400 && closestArr[1] < arrows[arrowMassIndex][1]){ //hit
                    closestArr[0] = arrowMassIndex;
                    closestArr[1] = arrows[arrowMassIndex][1];
                    setTemp = true;
                    hit();
                }else if (arrows[arrowMassIndex][1] > 350 && closestArr[1] < arrows[arrowMassIndex][1]){ //miss
                    closestArr[0] = arrowMassIndex;
                    closestArr[1] = arrows[arrowMassIndex][1];
                    setTemp = true;
                    MissNote();
                } 
            }
        }
        if (setTemp){
            arrows[closestArr[0]][0].remove()
            arrows[closestArr[0]] = null;
            arrows = arrows.filter(n => n);

        }
    }
    if (event.key == "f") {
        if (debounce[1]) {return}
        debounce[1] = true;
        let closestArr = [0,0];
        let setTemp = false;
        for(let arrowMassIndex = 0; arrowMassIndex < arrows.length; arrowMassIndex+=1){
            if (arrows[arrowMassIndex][2] == 1) {
                // console.log(arrows[arrowMassIndex][1] > 400, closestArr[1] < arrows[arrowMassIndex][1]);
                if (arrows[arrowMassIndex][1] > 440 && closestArr[1] < arrows[arrowMassIndex][1]){//perfect hit
                    closestArr[0] = arrowMassIndex;
                    closestArr[1] = arrows[arrowMassIndex][1];
                    setTemp = true;
                    hitperfect();
                }else if (arrows[arrowMassIndex][1] > 400 && closestArr[1] < arrows[arrowMassIndex][1]){ //hit
                    closestArr[0] = arrowMassIndex;
                    closestArr[1] = arrows[arrowMassIndex][1];
                    setTemp = true;
                    hit();
                }else if (arrows[arrowMassIndex][1] > 350 && closestArr[1] < arrows[arrowMassIndex][1]){ //miss
                    closestArr[0] = arrowMassIndex;
                    closestArr[1] = arrows[arrowMassIndex][1];
                    setTemp = true;
                    MissNote();
                } 
            }
        }
        if (setTemp){
            arrows[closestArr[0]][0].remove()
            arrows[closestArr[0]] = null;
            arrows = arrows.filter(n => n);
        }
    }
    if (event.key == "j") {
        if (debounce[2]) {return}
        debounce[2] = true;
        let closestArr = [0,0];
        let setTemp = false;
        for(let arrowMassIndex = 0; arrowMassIndex < arrows.length; arrowMassIndex+=1){
            if (arrows[arrowMassIndex][2] == 2) {
                // console.log(arrows[arrowMassIndex][1] > 400, closestArr[1] < arrows[arrowMassIndex][1]);
                if (arrows[arrowMassIndex][1] > 440 && closestArr[1] < arrows[arrowMassIndex][1]){//perfect hit
                    closestArr[0] = arrowMassIndex;
                    closestArr[1] = arrows[arrowMassIndex][1];
                    setTemp = true;
                    hitperfect();
                }else if (arrows[arrowMassIndex][1] > 400 && closestArr[1] < arrows[arrowMassIndex][1]){ //hit
                    closestArr[0] = arrowMassIndex;
                    closestArr[1] = arrows[arrowMassIndex][1];
                    setTemp = true;
                    hit();
                }else if (arrows[arrowMassIndex][1] > 350 && closestArr[1] < arrows[arrowMassIndex][1]){ //miss
                    closestArr[0] = arrowMassIndex;
                    closestArr[1] = arrows[arrowMassIndex][1];
                    setTemp = true;
                    MissNote();
                } 
            }
        }
        if (setTemp){
            arrows[closestArr[0]][0].remove()
            arrows[closestArr[0]] = null;
            arrows = arrows.filter(n => n);
        }
    }
    if (event.key == "k") {
        if (debounce[3]) {return}
        debounce[3] = true;
        let closestArr = [0,0];
        let setTemp = false;
        for(let arrowMassIndex = 0; arrowMassIndex < arrows.length; arrowMassIndex+=1){
            if (arrows[arrowMassIndex][2] == 3) {
                // console.log(arrows[arrowMassIndex][1] > 400, closestArr[1] < arrows[arrowMassIndex][1]);
                if (arrows[arrowMassIndex][1] > 440 && closestArr[1] < arrows[arrowMassIndex][1]){//perfect hit
                    closestArr[0] = arrowMassIndex;
                    closestArr[1] = arrows[arrowMassIndex][1];
                    setTemp = true;
                    hitperfect();
                }else if (arrows[arrowMassIndex][1] > 400 && closestArr[1] < arrows[arrowMassIndex][1]){ //hit
                    closestArr[0] = arrowMassIndex;
                    closestArr[1] = arrows[arrowMassIndex][1];
                    setTemp = true;
                    hit();
                }else if (arrows[arrowMassIndex][1] > 350 && closestArr[1] < arrows[arrowMassIndex][1]){ //miss
                    closestArr[0] = arrowMassIndex;
                    closestArr[1] = arrows[arrowMassIndex][1];
                    setTemp = true;
                    MissNote();
                } 
            }
        }
        if (setTemp){
            arrows[closestArr[0]][0].remove()
            arrows[closestArr[0]] = null;
            arrows = arrows.filter(n => n);
          
        }
    }
    // if(event.key == "r"){
    //     gameon = false;
    // }
});
document.addEventListener('keyup', function (event) {
    if (event.key == "d") {
        debounce[0] = false
    }
    if (event.key == "f") {
        debounce[1] = false;
    }
    if (event.key == "j") {
        debounce[2] = false;
    }
    if (event.key == "k") {
        debounce[3] = false;
    }
});

function checkselected(){

    var ddl = document.getElementById("song-select");
    var selectedValue = ddl.options[ddl.selectedIndex].value;
    if(selectedValue=='Tutorial'){
    chart = 'Songs/tutorial.json';
    vocals = document.getElementById('TSongV');
    inst = document.getElementById("TSongI");
    document.getElementById("difficulty").innerHTML='Easy';
    document.getElementById("songbpm").innerHTML='BPM: 75';
    document.getElementById("songlength").innerHTML='Length: 0:15';
    }
    if(selectedValue=='YMMS'){
    chart = 'Songs/ymms.json';
    vocals = document.getElementById("YMMSV");
    inst = document.getElementById("YMMSI");
    document.getElementById("difficulty").innerHTML='Easy';
    document.getElementById("songbpm").innerHTML='BPM: 127';
    document.getElementById("songlength").innerHTML='Length: 0:12';
    }
    if(selectedValue=='AcidBack'){
    chart = 'Songs/Acidic-backstory.json';
    vocals = document.getElementById("ABSongV");
    inst = document.getElementById("ABSongI");
    document.getElementById("difficulty").innerHTML='Hard';
    document.getElementById("songbpm").innerHTML='BPM: 175';
    document.getElementById("songlength").innerHTML='Length: 1:57';
    }
    if(selectedValue=='AcidTalk'){
    chart = 'Songs/Acid-talk.json';
    vocals = document.getElementById("ATSongV");
    inst = document.getElementById("ATSongI");
    document.getElementById("difficulty").innerHTML='Insane';
    document.getElementById("songbpm").innerHTML='BPM: 190';
    document.getElementById("songlength").innerHTML='Length: 1:21';
    }
    if(selectedValue=='Test'){
    chart = 'Songs/test.json';
    vocals = document.getElementById("TestSongV");
    inst = document.getElementById("TestSongI");
    document.getElementById("difficulty").innerHTML='Hard';
    document.getElementById("songbpm").innerHTML='BPM: 150';
    document.getElementById("songlength").innerHTML='Length: 1:42';
    }
    if(selectedValue=='Infected'){
    chart = 'Songs/infection.json';
    vocals = document.getElementById("ISongV");
    inst = document.getElementById("ISongI");
    document.getElementById("difficulty").innerHTML='Hard';
    document.getElementById("songbpm").innerHTML='BPM: 175';
    document.getElementById("songlength").innerHTML='Length: 1:51';
    }
}

function songplay(){
    vocals.play();
    vocals.volume = 1;
    inst.play();
    inst.volume = 1;
}

let arrows = [];
let timems = 0;
let gameon=true;
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function main() {
    document.getElementById("playbutton").disabled = true;
    document.getElementById("HeatGain").disabled = true;
    document.getElementById("HeatDrain").disabled = true;
    document.getElementById("HealthGain").disabled = true;
    document.getElementById("HealthDrain").disabled = true;
    document.getElementById("IceGain").disabled = true;
    document.getElementById("PassiveIceMelt").disabled = true;
    setInterval(healing, 100);
    songplay();
    const json = await fetch(chart).then(response => response.json());
    const bpm = json['song']['bpm']; //find bpm
    const speed = json['song']['speed'];
    const layout = json['song']['notes'];
    //const scrollspeed = (450 * bpm / 60) * speed /  100;
    const refRate = 100;
    const StartTime = new Date().getTime();
    let Loops = 0;
    let SpeedDiv = 5; //was 10
    const Offset = (500 / (refRate/SpeedDiv))*100;
    //const Offset = 4500;
    //console.log(Offset);
    
    let iteratednote = 0;
    let ended = false;
    let prewTimeMs = -99999;
    let notesSpawned = 0;
    let maxTime = 0;
    // console.log(layout);
    while (gameon) {
        //document.getElementById("ok").innerHTML=`Score: ${timems}`;
        let spawned = false;
        Loops+=1;
        // console.log("_");
        
        for(let x = iteratednote; x < layout.length; x+=1){
            if (ended) {
                break;
            }
            // console.log(iteratednote);
            // if (layout[x]["sectionNotes"].length == 0) {
            //     iteratednote += 1;
            //     if (iteratednote == layout[x]["sectionNotes"].length) {
            //         ended = true;
            //     }
            //     continue
            // }
            for(let y = 0; y < layout[x]["sectionNotes"].length; y+=1){
                // console.log(y, iterationSection, layout[x]["sectionNotes"].length);
                
                //console.log(timems, prewTimeMs,layout[x]["sectionNotes"][y][0],layout[x]["sectionNotes"][y][0]-Offset, layout[x]["sectionNotes"][y][0]-Offset >= prewTimeMs, timems >= layout[x]["sectionNotes"][y][0]-Offset );
                
                // console.log(y, iterationSection, layout[x]["sectionNotes"].length);
                if (layout[x]["sectionNotes"][y][0]-Offset > prewTimeMs && timems >= layout[x]["sectionNotes"][y][0]-Offset ) {
                    spawned = true;
                    maxTime = timems;
                    //console.log('AHG');
                    spawnarrow(layout[x]["sectionNotes"][y][1]);
                    notesSpawned += 1;
                    if (notesSpawned + 1 == layout[x]["sectionNotes"].length) {
                        iteratednote += 1;
                        if (iteratednote == layout[x]["sectionNotes"].length) {
                            ended = true;
                        }
                    }
                }
            }
            prewTimeMs = maxTime;
            // break;
        }
        // console.log(arrows);
        for(let arrowMassIndex = 0; arrowMassIndex < arrows.length; arrowMassIndex+=1){
            arrows[arrowMassIndex][0].style.transform = `translateY(${arrows[arrowMassIndex][1]}px)`;
            // console.log(`translateY(${arrowMassIndex[1]})px`);
            arrows[arrowMassIndex][1] += refRate/SpeedDiv; //10
            if (arrows[arrowMassIndex][1] > 500) {
                MissNote();
                arrows[arrowMassIndex][0].remove()
                arrows[arrowMassIndex] = null;
            }
        }
        arrows = arrows.filter(n => n);
        await sleep(refRate + ((Loops * refRate) - (new Date().getTime() - StartTime)));
        // console.log((Loops * refRate) - (new Date().getTime() - StartTime));
        
        timems += refRate;
    }   
}

function spawnarrow(position){
    
    const newDiv = document.createElement("div");
    newDiv.style.position = 'absolute';
    newDiv.style.height = '48px';
    newDiv.style.width = '48px';
    switch(position) {
        case 0:
        newDiv.style.backgroundColor = 'purple';
        newDiv.style.border = 'solid, 2px, rgb(80, 0, 80)';
        leftlane.appendChild(newDiv);
        arrows.push([newDiv, 0, 0]);
        break;
    case 1:
        newDiv.style.backgroundColor = 'cyan';
        newDiv.style.border = 'solid, 2px, rgb(0, 141, 141)';
        downlane.appendChild(newDiv);
        arrows.push([newDiv, 0, 1]);
        break;
    case 2:
        newDiv.style.backgroundColor = 'lime';
        newDiv.style.border = 'solid, 2px, rgb(0, 121, 0)';
        uplane.appendChild(newDiv);
        arrows.push([newDiv, 0, 2]);
        break;
    case 3:
        newDiv.style.backgroundColor = 'red';
        newDiv.style.border = 'solid, 2px, rgb(141, 0, 0)';
        rightlane.appendChild(newDiv);
        arrows.push([newDiv, 0, 3]);
        break;
    default:
        break;
    }
}
