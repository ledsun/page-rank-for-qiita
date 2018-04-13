# Qiitaから被参照数が1以上の記事を取得

Qiitaの記事を検索するコマンドです。
ページランクが1以上の記事を検索します。
検索絞り込み条件にタグを指定することができます。

## Note

βレベルです。
引数などのインタフェースは変更する予定です。

## Page Rank
被参照のうち、次のものを除いた数をページランクとします。

* 作者本人の記事からのリンク
* [【毎日自動更新】Qiitaのデイリーストックランキング！ウィークリーもあるよ - Qiita](https://qiita.com/takeharu/items/bb154a4bc198fb102ff3) のようにbotで生成したページからのリンク



## Install

```
npm i -g page-rank-for-qiita
```

## Usage

環境変数でQiita APIへのアクセストークンを指定してください。

```
env ACCESS_TOKEN=YOUR_ACCESS_TOKEN panq bash
```

アクセストークンは [Applications - Qiita](https://qiita.com/settings/applications) にて生成してください。

### Results

ページランクが1以上の記事が見つかるまで探し続けるので、結果が出るまで数分掛かることがあります。

```sh
Gitのブランチ名を返すエイリアスを設定したら地味に捗った	https://qiita.com/kmszk/items/3de61ef75e30dedd6f6e	1
AtCoderに登録したら解くべき精選過去問 10 問を bash で解いてみた	https://qiita.com/yuizumi/items/d55f9dfe56fa2bf12d94	1
AtCoder に登録したら解くべき精選過去問 10 問を Bash で解いてみた	https://qiita.com/cympfh/items/b860ecb5f5415b15f3c9	3
ShellScriptでよく使う表現	https://qiita.com/rotocuir/items/986e8ee732730606622b	1
bash コーディングルール	https://qiita.com/mato-599/items/053ca6e00fb747147e1c	1
TTY/PTYに関するクイズ	https://qiita.com/angel_p_57/items/ff1c0d054714b7982ca5	1
bashスクリプトやPHPを実行できるslack botを作る	https://qiita.com/mokamoto12/items/17d341328f3275fba66b	1
いまどきのネットワークOSのお話	https://qiita.com/kkureish/items/2958b3385b91c71b7050	1
pushd と dirs を peco でちょっと便利に使う	https://qiita.com/tsubasaogawa/items/f1c9de7062bf3ee165a8	1
vim色に染まれ．機能紹介のついでにbashをvi仕様に．	https://qiita.com/Pseudonym/items/2cb442ff257a2f9f9d70	1
【バイナリファイル入門】Bitmapファイルを手書きで作って遊んでみる	https://qiita.com/chooyan_eng/items/151e67684e5ef8d1a695	1
ANSIエスケープシーケンス チートシート	https://qiita.com/PruneMazui/items/8a023347772620025ad6	1
digdagコマンドが fish 互換無かったときにしたこと	https://qiita.com/takat0-h0rikosh1/items/d0caacda93ff68ed2bde	1
[Bash on Windows] ev3rt開発環境をWindowsで作る2	https://qiita.com/Shitimi_613/items/051d04eb139043222567	2
[Bash on Windows] ev3rt開発環境をWindowsで作る1	https://qiita.com/Shitimi_613/items/09bec911048e55285868	2
windows10で快適なCUI環境を構築する	https://qiita.com/vitway/items/e209fb4a4eb307de2d28	1
Visual Studio Code 15.1の統合シェルをMSYS2のbashにする	https://qiita.com/yumetodo/items/42132a1e8435504448aa	3
初心者向け：Zshの導入	https://qiita.com/iwaseasahi/items/a2b00b65ebd06785b443	1
Linux形式のパスをWindows形式のパスに変換してクリップボードにコピーする方法	https://qiita.com/KemoKemo/items/f91800836799102cf1f9	1
Linuxでキャッシュを追い出す方法	https://qiita.com/kawakamasu/items/97e114ba6b13cd33da0c	1
Bash on Windowsで真面目に開発環境を整備する	https://qiita.com/ryo-yamaoka/items/9db1a8643144565de103	1
Get,GetGetGetWildAndTough! bash版	https://qiita.com/fk_2000/items/e05ea9de9a1ac11c58dd	1
Cisco Catalyst IOS-XEでのPythonやBash	https://qiita.com/kikuta1978/items/1739d7d7063a20b1736f	1
Avoid warning of &#x60;brew doctor&#x60; with fish &amp; pyenv	https://qiita.com/komo/items/450180282766ffb250ba	1
[Mac OS X] OpenSSLバージョンの更新	https://qiita.com/smith_30/items/a275f30b040c1ea74520	1
[bash] 実行スクリプトの絶対パスの取得	https://qiita.com/koara-local/items/2d67c0964188bba39e29	1
コマンド入力一撃で端末を大量に分割してタスクを瞬殺するtmux-xpanes	https://qiita.com/greymd/items/8744d1c4b0b2b3004147	2
Visual Studio Codeの統合シェルをMSYS2のBashにしたら.bash_profileが読み込まれなかった	https://qiita.com/catfist/items/ea925fb9e0ba5c0ba9f3	1
bashで文字列分解する時、cutやawkもいいけど、setの方が早い、けどreadが最強	https://qiita.com/hasegit/items/5be056d67347e1553f08	1
bash history から特定のコマンド履歴を削除する	https://qiita.com/hkuno/items/7d7b8cf5881d659e965a	1
テキストファイルのヘッダー行(一番上の行)を取り除く	https://qiita.com/drwtsn64/items/76136d8e6f0d000165bf	1
毎月最終金曜（プレミアムフライデー）だったら実行するシェルスクリプト	https://qiita.com/Qrg/items/fd305ba60f93a97c4480	1
わーい、すごーい	https://qiita.com/fk_2000/items/afd5f4ca8f5bb25011c7	5
hub で GitHub にターミナルから issue、PR を作成する	https://qiita.com/fracmode/items/3d8b4e9d54a5c4a3ee5a	1
qiitaから自分のストックを全て削除したいスクリプト	https://qiita.com/positrium/items/b552bfa1a3659e653e33	1
bashの組込みコマンド自作によるスクリプトの高速化	https://qiita.com/satoru_takeuchi/items/7d424fa5ef1e33ace4df	2
```

結果の件数は、35件で制限しています。

結果は一時ディレクトリ内にキャッシュします。
二回目以降の実行では高速に結果を返します。
結果は得られるたびに保存しています。
コマンドを途中で止めても、それまでに得られた結果はキャッシュに保存しています。

### Argument

引数にはQiitaの記事についたtagを１つだけ指定できます。
指定しなかった場合は、tagで絞り込みません。

## Motivation

[Qiitaの記事を被参照数で評価すると？ - Qiita](https://qiita.com/ledsun/items/1f7572eacd6ce864e0db) を書いてみて、役に立ちそうだと思いました。
