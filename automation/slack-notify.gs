/**
 * グループホームおけらこ お問い合わせフォーム → Slack 自動通知スクリプト
 *
 * 【使い方】
 *  1. お問い合わせフォームを開く →「⋮（その他）」→「スクリプト エディタ」
 *  2. このコードを全て貼り付ける
 *  3. 下の SLACK_WEBHOOK_URL に、Slack の Incoming Webhook URL を貼る
 *  4. 左メニュー「トリガー（時計アイコン）」→「トリガーを追加」
 *       - 実行する関数: onFormSubmitToSlack
 *       - イベントのソース: フォームから
 *       - イベントの種類: フォーム送信時
 *  5. 保存。以降、回答があるたびに自動で Slack に通知されます。
 */

// ===== 設定：ここに Slack Incoming Webhook の URL を貼り付け =====
const SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/XXXXXXXX/YYYYYYYY/ZZZZZZZZ';

/**
 * フォーム送信時に自動実行される関数
 */
function onFormSubmitToSlack(e) {
  const itemResponses = e.response.getItemResponses();

  // 各質問と回答を Slack のセクションブロックに整形（項目が増減しても自動対応）
  const fieldBlocks = itemResponses.map(function (ir) {
    const question = ir.getItem().getTitle();
    let answer = ir.getResponse();
    if (Array.isArray(answer)) answer = answer.join(', ');
    if (answer === '' || answer == null) answer = '（未入力）';
    return {
      type: 'section',
      text: { type: 'mrkdwn', text: '*' + question + '*\n' + answer }
    };
  });

  // 送信日時（日本時間）
  const submittedAt = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy/MM/dd (E) HH:mm');

  const payload = {
    text: '🔔 新しいお問い合わせが届きました', // 通知ポップアップ・一覧用の要約
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: '🔔 新しいお問い合わせ', emoji: true }
      },
      {
        type: 'context',
        elements: [{ type: 'mrkdwn', text: '受信日時：' + submittedAt }]
      },
      { type: 'divider' }
    ].concat(fieldBlocks)
  };

  UrlFetchApp.fetch(SLACK_WEBHOOK_URL, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });
}
