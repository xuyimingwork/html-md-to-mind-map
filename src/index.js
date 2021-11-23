import 'd3'
import { Transformer } from 'markmap-lib';
import * as markmap from 'markmap-view';
const { Markmap, loadCSS, loadJS } = markmap;

function transform (transformer, content) {
  const { root, features } = transformer.transform(content)
  const { styles, scripts } = transformer.getUsedAssets(features);
  if (styles) loadCSS(styles);
  if (scripts) loadJS(scripts);
  return root
}

function renderMindmap(svg, data) {
  const lines = data.split('\n');
  let indent = Infinity;
  lines.forEach(line => {
    const spaces = line.match(/^\s*/)[0].length;
    if (spaces < line.length) indent = Math.min(indent, spaces);
  });
  const content = lines.map(line => line.slice(indent)).join('\n');
  const transformer = new Transformer();
  const mm = Markmap.create(svg);
  const render = () => {
    const root = transform(transformer, content)
    mm.setData(root)
    mm.fit();
  }
  transformer.hooks.retransform.tap(render);
  render();
}

window.renderMindmap = renderMindmap