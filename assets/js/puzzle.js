/*
 * puzzle.js  謎の答え合わせ（全ページ共通）
 *
 * 使い方：
 *   <form data-puzzle="スコープ名" data-wrong="不正解のときのメッセージ">
 *     <input type="text" name="answer">
 *     <button type="submit">送信</button>
 *     <p class="puzzle-message" data-puzzle-message aria-live="polite"></p>
 *   </form>
 *
 * 判定の流れ：
 *   1. 入力値を正規化する（前後の空白を除去 → 小文字化 → カタカナをひらがなへ）
 *   2. 「スコープ名:答え」を SHA-256 でハッシュ化し、先頭12桁をページ名にする
 *      ・入力欄が複数あるときは、上から順に「|」でつないでからハッシュ化する
 *      ・スコープ名は謎ごとに変える（別の謎で同じ答えがあっても、別のページへ飛ばせるように）
 *   3. truth/<12桁>.html があれば移動し、なければ不正解メッセージを表示する
 *
 * 答えに対応するファイル名は tools/hash.html で調べられる。
 */
(function () {
  'use strict';

  // 隠しページを置くフォルダ（このファイル assets/js/puzzle.js から見た位置）
  var HIDDEN_DIR = new URL('../../truth/', document.currentScript.src);
  var NAME_LENGTH = 12;
  var DEFAULT_WRONG = '答えが違います。';

  function normalize(text) {
    return text
      .trim()
      .toLowerCase()
      .replace(/[ァ-ヶ]/g, function (ch) {
        return String.fromCharCode(ch.charCodeAt(0) - 0x60);
      });
  }

  async function sha256Hex(text) {
    var bytes = new TextEncoder().encode(text);
    var digest = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest), function (b) {
      return b.toString(16).padStart(2, '0');
    }).join('');
  }

  async function pageName(scope, answers) {
    var key = answers.map(normalize).join('|');
    if (scope) key = scope + ':' + key;
    var hex = await sha256Hex(key);
    return hex.slice(0, NAME_LENGTH);
  }

  async function exists(url) {
    try {
      var res = await fetch(url, { method: 'HEAD', cache: 'no-store' });
      return res.ok;
    } catch (e) {
      return false;
    }
  }

  function setup(form) {
    var message = form.querySelector('[data-puzzle-message]');
    var inputs = form.querySelectorAll('input[type="text"]');

    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      var answers = Array.from(inputs, function (input) { return input.value; });
      if (answers.every(function (a) { return a.trim() === ''; })) return;

      if (message) message.textContent = '';
      var name = await pageName(form.dataset.puzzle, answers);
      var url = new URL(name + '.html', HIDDEN_DIR);

      if (await exists(url)) {
        location.href = url.href;
      } else if (message) {
        message.textContent = form.dataset.wrong || DEFAULT_WRONG;
      }
    });
  }

  document.querySelectorAll('form[data-puzzle]').forEach(setup);

  // 作者用ツール（tools/hash.html）から使う
  window.Puzzle = { normalize: normalize, pageName: pageName };
})();
