export function doPrint(ID = 'subOutputRank-print') {
  let subOutputRankPrint = document.getElementById(ID);
  let newContent = subOutputRankPrint.innerHTML;
  let oldContent = document.body.innerHTML;
  document.body.innerHTML = newContent;
  window.print();
  window.location.reload();
  document.body.innerHTML = oldContent;
  return false;
}