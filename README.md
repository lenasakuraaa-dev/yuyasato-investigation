# yuyasato-investigation

謎解き要素のある ARG 形式の Web サイト（ドラフト版）。GitHub Pages で公開する。

## ローカルで確認する
`file://` で直接開くと謎の答え合わせが動かないため、ローカルサーバー経由で開く。

```
python -m http.server 8000
```

ブラウザで http://localhost:8000/ を開く。

## 謎の答えを追加・変更する
1. http://localhost:8000/tools/hash.html を開き、スコープ名（フォームの `data-puzzle` の値）と答えを入力する
2. 表示されたファイル名で `truth/` に HTML と CSS を置く（答えを変える場合は既存ファイルの名前を変える）
3. `docs/page-map.md` を更新する

## 資料
- `CLAUDE.md`：要件・仕組み・コーディング規約
- `docs/page-map.md`：Canva のページとファイルの対応表
- `docs/canva-improvements.md`：Canva デザインの改善点
