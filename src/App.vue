<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { ref } from '@vue/reactivity';
import d3Script from './assets/d3.min.js?raw';
import markmapLibScript from './assets/markmap-lib.min.js?raw';
import markmapViewScript from './assets/markmap-view.min.js?raw';
import md2mmScript from './assets/md2mm.js?raw';

// HTML 文件
const html = ref('')
function updateHTMLFromFile(file: any) {
  return new Promise<string>((resolve, reject) => {
    if (!file) reject()
    var r = new FileReader();
    r.onload = function (e) {
      resolve(e.target?.result as string)
    }
    r.readAsText(file);
  })
    .then((text: string) => {
      html.value = text
    })
}
const selectors = ref('body > pre > code')
const where = ref(`(el, $svg) => {
  el.parentNode.parentNode.insertBefore($svg, el.parentNode.nextSibling)
}`)
const style = ref('width: 800px; height: 800px;')
const iframeHtml = ref('')
function preview() {
  const a = '<scri'
  const b = 'pt>'
  const c = '</scri'
  const d = 'pt>'
  const script = (script: string) => `${a}${b}${script}${c}${d}`
  iframeHtml.value = html.value 
    + script(d3Script)
    + script(markmapLibScript)
    + script(markmapViewScript)
    + script(`
        window.markmapConfig = {
          selectors: '${selectors.value}',
          where: ${where.value ? where.value : 'undefined'},
          style: ${style.value ? `'${style.value}'` : 'undefined'},
        }
    `)
    + script(md2mmScript)
}
function download() {
  preview()
  const link = document.createElement('a');
  link.download = 'index.html';
  const blob = new Blob([iframeHtml.value], {type: 'text/plain'});
  link.href = window.URL.createObjectURL(blob);
  link.click();
}
</script>

<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form label-width="120px">
          <el-form-item>
            <div style="display: flex;">
              <el-upload
                :action="''"
                :auto-upload="false"
                :multiple="false"
                :show-file-list="false"
                @change="(file: any, files: []) => {
                  if (files.length > 1) files.splice(0, 1)
                  updateHTMLFromFile(file?.raw)
                }"
              >
                <div />
                <template #trigger>
                  <el-button>上传HTML文件</el-button>
                </template>
              </el-upload>
              <el-button 
                type="primary" 
                style="margin-left: 10px;"
                :disabled="!html"
                @click="() => preview()">预览</el-button>
              <el-button 
                style="margin-left: 10px;"
                :disabled="!html"
                @click="() => download()">下载</el-button>
            </div>
          </el-form-item>
          <el-form-item label="markdown 路径">
            <el-input v-model="selectors" />
          </el-form-item>
          <el-form-item label="脑图插入位置">
            <el-input type="textarea" :rows="6" v-model="where" />
          </el-form-item>
          <el-form-item label="脑图样式">
            <el-input v-model="style" />
          </el-form-item>
        </el-form>
        <el-input
          v-model="html"
          :rows="20"
          type="textarea"
        />
      </el-col>
      <el-col :span="16">
        <iframe 
          style="width: 100%; height: 100%;"
          :srcdoc="iframeHtml" />
      </el-col>
    </el-row>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
