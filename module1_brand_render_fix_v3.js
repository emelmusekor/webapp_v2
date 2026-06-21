// Immediate render fix: button handlers call render(), core renderer is route().
function render(){
  route();
}
window.render = render;
