/*
 * include.js  共通部分の読み込み（日記ページ用）
 *
 * 使い方：
 *   <div data-include="diary-header"></div>
 *   …
 *   <script src="（assets/js/ までの相対パス）include.js"></script>
 *
 * 動き：
 *   1. data-include="名前" の要素を探し、assets/partials/名前.html を読み込む
 *   2. 共通部分の中の href・src は「共通部分のファイルから見た相対パス」で書いてあるので、
 *      どの深さのページから読み込んでも正しく開けるように書き換える
 *   3. data-include の要素を、読み込んだ中身で置き換える
 *
 * file:// で直接開くと読み込めないため、ローカルサーバーで確認すること。
 */
(function () {
  'use strict';

  // 共通部分を置くフォルダ（このファイル assets/js/include.js から見た位置）
  var PARTIALS_DIR = new URL('../partials/', document.currentScript.src);

  async function load(target) {
    var url = new URL(target.dataset.include + '.html', PARTIALS_DIR);
    var res = await fetch(url);
    if (!res.ok) throw new Error(url.href + ' を読み込めませんでした');

    var template = document.createElement('template');
    template.innerHTML = await res.text();

    // パスを「共通部分のファイルから見た位置」で解決し直す
    template.content.querySelectorAll('[href], [src]').forEach(function (el) {
      ['href', 'src'].forEach(function (attr) {
        var value = el.getAttribute(attr);
        if (value && value.charAt(0) !== '#') {
          el.setAttribute(attr, new URL(value, url).href);
        }
      });
    });

    target.replaceWith(template.content);
  }

  document.querySelectorAll('[data-include]').forEach(function (target) {
    load(target).catch(function (error) {
      console.error(error);
    });
  });
})();
