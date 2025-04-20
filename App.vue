<script setup>
import { onMounted, ref } from 'vue';
const list = ref([]);
const mediasrc = ref('');
const mediatype = ref('');
const playerOn = ref(false);
const playmode = ref('顺序');
const isLoopOn = ref(false);

let playid = 0;

function makeoutlist(e) {
    list.value = [];
    for (let i = 0 ; i < e.target.files.length ; i++ ) {
        list.value.push({ id: i, obj: e.target.files[i], name: e.target.files[i].name });
    }
}
function play(row) {
    player(row.id);
    
}
function playauto() {
  if (playmode.value == '顺序') {
      let id = playid + 1;
      player(id);
    }
    if (playmode.value == '随机') {
      let id = Math.floor(Math.random()*(list.value.length));
      if (id == playid || id != 0) {
        id = Math.floor(Math.random()*(list.value.length));
      }
    player(id);
    }
}
function playpervious () {
  if (playid == 0)  {
    return
  }
  player(playid - 1);
}
function playnext() {
  if (playmode.value == '随机') {
    let nplayid = Math.floor(Math.random()*(list.value.length));
      if (nplayid == playid || nplayid != 0) {
        nplayid = Math.floor(Math.random()*(list.value.length));
      }
      player(nplayid)
    } else {
      player(playid + 1);
    }
}
function player(id) {
    playid = id;
    playerOn.value = true;
    if(list.value[id].obj.type.includes('audio')) {
        mediatype.value = "audio";
    }
    if(list.value[id].obj.type.includes('video')) {
        mediatype.value = "video";
    }
    mediasrc.value =  URL.createObjectURL(list.value[id].obj);
}    
function switchmode() {
    if (playmode.value == '顺序') {
      playmode.value = '循环';
      isLoopOn.value = true;
    } else if (playmode.value == '循环') {
      playmode.value = '随机';
      isLoopOn.value = false;
    } else if (playmode.value == '随机') {
      playmode.value = '顺序';
      isLoopOn.value = false;
    }
}
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js') // 指定 Service Worker 文件路径
    .then(registration => console.log('ServiceWorker 注册成功'))
    .catch(err => console.log('注册失败:', err));
}
</script>

<template>
  <head>
   
  </head>
  <div class="common-layout">
    <el-container >
      <el-header style="border-bottom: 1px solid var(--el-border-color); height: 6vh; display: flex; align-items: center">
            PlayerWeb
      </el-header>
      <el-container>
        <el-main style="height: 85vh;">
          <input 
            type="file" 
            ref="fileInput" 
            @change="makeoutlist" 
            style="display: none"
            multiple
          >
          <el-button @click="$refs.fileInput.click()" type="primary">打开媒体文件</el-button>
          <video  v-if="mediatype == 'video'" style="width:100%" controls  @ended="playauto" :src="mediasrc" autoplay  v-bind:loop="isLoopOn"></video>
          <audio  v-if="mediatype == 'audio'" style="width:100%" controls   @ended="playauto"  :src="mediasrc" autoplay v-bind:loop="isLoopOn" ></audio>
          <div v-if="playerOn" >
          <div  style="display: flex;justify-content: space-between;" >
            <el-button  type="danger" style="text-align: left;" @click="switchmode">{{ playmode }}</el-button>
            <div><el-button  style="text-align: right;"  @click="playpervious">上一个</el-button>
            <el-button  style="text-align: right;"  @click="playnext">下一个</el-button></div>
          </div>
          </div>
          <el-table @row-click="play" :data="list" height="40vh" style="width: 100%">
          <el-table-column  prop="name" label="播放列表" />
          </el-table>
          </el-main>
        </el-container>
    </el-container>
  </div>
</template>

<style>
</style>
