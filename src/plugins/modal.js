import { Message, MessageBox, Notification, Loading } from 'element-ui'
import { translate as $t } from "@/lang"

let loadingInstance;

export default {
  // Message prompt
  msg(content) {
    Message.info(content)
  },
  // error message
  msgError(content) {
    Message.error(content)
  },
  // success message
  msgSuccess(content) {
    Message.success(content)
  },
  // warning message
  msgWarning(content) {
    Message.warning(content)
  },
  // Pop up prompt
  alert(content) {
    MessageBox.alert(content, $t('modal.systemTip'))
  },
  // Error Message
  alertError(content) {
    MessageBox.alert(content, $t('modal.systemTip'), { type: 'error' })
  },
  // Tips for success
  alertSuccess(content) {
    MessageBox.alert(content, $t('modal.systemTip'), { type: 'success' })
  },
  // Warning
  alertWarning(content) {
    MessageBox.alert(content, $t('modal.systemTip'), { type: 'warning' })
  },
  // Notification tips
  notify(content) {
    Notification.info(content)
  },
  // Error notification
  notifyError(content) {
    Notification.error(content);
  },
  // Success notification
  notifySuccess(content) {
    Notification.success(content)
  },
  // warning notification
  notifyWarning(content) {
    Notification.warning(content)
  },
  // Confirmation form
  confirm(content) {
    return MessageBox.confirm(content, $t('modal.systemTip'), {
      confirmButtonText: $t('commonBtn.confirm'),
      cancelButtonText: $t('commonBtn.cancel'),
      type: "warning",
    })
  },
  // Submit content
  prompt(content) {
    return MessageBox.prompt(content, $t('modal.systemTip'), {
      confirmButtonText: $t('commonBtn.confirm'),
      cancelButtonText:  $t('commonBtn.cancel'),
      type: "warning",
    })
  },
  // Open mask layer
  loading(content) {
    loadingInstance = Loading.service({
      lock: true,
      text: content,
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)",
    })
  },
  // Turn off mask layer
  closeLoading() {
    loadingInstance.close();
  }
}
