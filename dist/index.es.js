var flatten$1=function r(e){return e instanceof Array?e.reduce(function(e,t){return t instanceof Array?e.push.apply(e,r(t)):t?e.push(t):e.push(null),e},[]):e},_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(r){return typeof r}:function(r){return r&&"function"==typeof Symbol&&r.constructor===Symbol&&r!==Symbol.prototype?"symbol":typeof r},Tensor$2=function(){var r={order:0,orders:[]},e={},t=[];function n(r,t,n){var o=e[r];return"number"!=typeof o[t]&&(o[t]=Object.keys(o).length),n[o[t]]instanceof Array||(n[o[t]]=[]),o[t]}function o(t,n){for(var o=new Array(r.order).fill(null),i=0,f=t.length;i<f;i++){var u=t[i],c=r.orders.indexOf(u);if(-1===c)throw new Error("Vector Error: Index "+u+" not found in available indices: "+r.orders.join(", ")+".");if("string"!=typeof n[u]){if("number"!=typeof n[u])throw new Error("Vector Error: Value "+n[u]+" for index "+u+" is not a valid string or integer.");o[c]=n[u]}else if(o[c]=e[u][n[u]],void 0===o[c])throw new Error("Vector Error: Label "+[n[u]]+" not found in index "+u+" labels: "+Object.keys(e[u]).join(", "))}return o}function i(r,e){return e&&e.length?i(r[e.shift()],e):r}return this.getIndices=function(){var r={};return Object.keys(e).forEach(function(t){r[t]=Object.keys(e[t])}),r},this.getIndexLabels=function(r){return e[r]?Object.keys(e[r]):null},this.getVector=function(e){if(!e||"object"!==(void 0===e?"undefined":_typeof(e)))throw new Error("Vector Error: Malformed vertices provided.");var n=Object.keys(e);if(n.length!==r.order-1)throw new Error("Vector Error: "+n.length+" vertices provided for "+r.order+" order tensor. The number of vertices must be equal to n - 1, where n is the order of the tensor.");var f=o(n,e),u=f.indexOf(null),c=0===u?(f.splice(0,1),t.map(function(r){return i(r,[].concat(f))})):i(t,f.slice(0,u)).map(function(r){return i(r,f.slice(u+1))});return flatten$1(c)},this.getScalar=function(e){var n=Object.keys(e);if(n.length!==r.order)throw new Error("Scalar Error: "+n.length+" vertices provided for "+r.order+" order tensor. The number of vertices must be equal to n, where n is the order of the tensor.");for(var i=o(n,e),f=0,u=t;f<i.length;){if(!u[i[f]])return null;u=u[i[f]],f+=1}return u[0]},this.debug=function(){return{matrix:t,indices:e,props:r}},function(o){var i=o.data,f=o.orders;return r.order=f.length,r.orders=f,function(){for(var r=f.length;r--;)e[f[r]]={}}(),i.forEach(function(e){for(var o=0,i=t;o<r.order;){var u=f[o];i=i[n(u,e[u],i)],o+=1}i.push(e)}),this}.apply(this,arguments)};export default Tensor$2;
//# sourceMappingURL=index.es.js.map
