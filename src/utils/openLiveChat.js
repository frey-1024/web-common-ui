export default function openLiveChat(planBtn) {
  const left = window.screen.width - 490;
  const pathname =
    window.location.protocol + '//' + window.location.host + window.location.pathname;
  window.open(
    '/service/livechat.html?href=' + pathname + '&planBtn=' + planBtn,
    '_blank',
    'height=560,width=480,top=0,left=' +
      left +
      ',toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no'
  );
}
