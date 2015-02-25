(function (global) {
  'use strict';

  document.addEventListener('DOMContentLoaded', onDomReady, false);

  function onDomReady() {
    var btn = document.querySelector('.btn');

    btn.addEventListener('click', function (evt) {
      evt.preventDefault();
      document.body.classList.toggle('open');
    }, false);
  }

}(this));
