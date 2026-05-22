/**
 * グループホームおけらこ お問い合わせフォーム → Slack 自動通知スクリプト
 *
 * 【使い方】
 *  1. お問い合わせフォームを開く →「⋮（その他）」→「Apps Script」
 *  2. 既存コードを全消しして、このコードを貼り付ける
 *  3. 下の SLACK_WEBHOOK_URL に、Slack の Incoming Webhook URL を貼る
 *  4. 左メニュー「トリガー（時計アイコン）」→「トリガーを追加」
 *       - 実行する関数: onFormSubmitToSlack
 *       - イベントのソース: フォームから
 *       - イベントの種類: フォーム送信時
 *  5. 保存 → 初回はGoogleの認証（「Advanced」→「Go to ...」→「Allow」）
 *
 * 【注意】メールアドレスについて
 *  Googleフォームの「メールアドレスを収集する」設定で集めたメールは、
 *  質問一覧(getItemResponses)には含まれず、getRespondentEmail() で別途取得する。
 *  本スクリプトは両方に対応済み。
 */

// ===== 設定：ここに Slack Incoming Webhook の URL を貼り付け =====
const SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/XXXXXXXX/YYYYYYYY/ZZZZZZZZ';

function onFormSubmitToSlack(e) {
  const fieldBlocks = [];

  // フォーム設定「メールアドレスを収集する」で集めたメールを取得
  let email = '';
  try { email = e.response.getRespondentEmail(); } catch (err) {}
  if (email) {
    fieldBlocks.push({ type: 'section', text: { type: 'mrkdwn', text: '*メールアドレス*\n' + email } });
  }

  // 各質問と回答（項目が増減しても自動対応）
  e.response.getItemResponses().forEach(function (ir) {
    const question = ir.getItem().getTitle();
    let answer = ir.getResponse();
    if (Array.isArray(answer)) answer = answer.join(', ');
    if (answer === '' || answer == null) answer = '（未入力）';
    fieldBlocks.push({ type: 'section', text: { type: 'mrkdwn', text: '*' + question + '*\n' + answer } });
  });

  const submittedAt = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy/MM/dd (E) HH:mm');
  const payload = {
    text: '🔔 新しいお問い合わせが届きました', // 通知ポップアップ・一覧用の要約
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: '🔔 新しいお問い合わせ', emoji: true } },
      { type: 'context', elements: [{ type: 'mrkdwn', text: '受信日時：' + submittedAt }] },
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
