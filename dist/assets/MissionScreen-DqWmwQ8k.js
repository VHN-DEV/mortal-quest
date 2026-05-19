import{s as e}from"./index-B6dSyC8m.js";import"./vendor-capacitor-DNzPfH2b.js";import"./vendor-gsap-CzGW6FVa.js";class u{constructor(){this.initElements(),this.initEvents()}initElements(){this.el=document.getElementById("mission-screen"),this.elList=document.getElementById("mission-list"),this.btnClose=document.getElementById("btn-close-mission"),this.btnRefresh=document.getElementById("btn-refresh-mission")}initEvents(){this.btnClose&&(this.btnClose.onclick=()=>this.close()),this.btnRefresh&&(this.btnRefresh.onclick=()=>{e.systems.mission.refreshMissions(),this.render(),e.ui.toast("Đã làm mới bảng nhiệm vụ","success")})}open(){e.ui.toggleOverlay(this.el,!0),this.render()}close(){e.ui.toggleOverlay(this.el,!1)}render(){if(!this.elList||!e.systems.mission)return;this.elList.innerHTML="";const n=e.systems.mission.missions;if(n.length===0){this.elList.innerHTML='<div class="text-center text-gray-500 py-10 italic">Hiện không có nhiệm vụ nào khả dụng...</div>';return}n.forEach(t=>{const s=document.createElement("div"),i=t.status==="active",o=i&&t.progress>=t.target;s.className=`mission-card p-4 rounded-xl border mb-3 transition-all ${i?"bg-qi-blue/5 border-qi-blue/30":"bg-white/5 border-white/10 hover:border-white/30"}`;const c=t.progress/t.target*100;s.innerHTML=`
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <h3 class="text-lg font-bold text-qi-blue font-ancient">${t.title}</h3>
                        <p class="text-xs text-gray-400 mt-1">${t.description}</p>
                    </div>
                    <div class="text-right">
                        <span class="text-qi-jade font-mono text-sm">${t.reward.toLocaleString()} <i class="ph ph-coins"></i></span>
                    </div>
                </div>
                
                ${i?`
                    <div class="mt-4">
                        <div class="flex justify-between text-[10px] mb-1">
                            <span class="text-gray-500">Tiến độ</span>
                            <span class="text-white">${t.progress}/${t.target}</span>
                        </div>
                        <div class="w-full h-1 bg-black/40 rounded-full overflow-hidden">
                            <div class="h-full bg-qi-blue transition-all duration-500" style="width: ${c}%"></div>
                        </div>
                    </div>
                `:""}

                <div class="mt-4 flex justify-end">
                    ${i?o?`
                        <button class="btn-complete px-4 py-1 bg-qi-jade/20 border border-qi-jade/50 rounded-full text-xs text-qi-jade hover:bg-qi-jade/40 transition-all animate-pulse">HOÀN THÀNH</button>
                    `:`
                        <button class="px-4 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-500 cursor-not-allowed">ĐANG THỰC HIỆN</button>
                    `:`
                        <button class="btn-accept px-4 py-1 bg-qi-blue/20 border border-qi-blue/50 rounded-full text-xs hover:bg-qi-blue/40 transition-all">NHẬN NHIỆM VỤ</button>
                    `}
                </div>
            `;const r=s.querySelector(".btn-accept");r&&(r.onclick=()=>{e.systems.mission.acceptMission(t.id),this.render()});const l=s.querySelector(".btn-complete");l&&(l.onclick=()=>{e.systems.mission.completeMission(t.id),this.render()}),this.elList.appendChild(s)})}}export{u as MissionScreen};
