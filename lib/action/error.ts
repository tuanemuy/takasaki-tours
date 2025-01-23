export const ActionError = {
  ValidationError: "validation-error",
  ParsingError: "parsing-error",
  NotFoundError: "not-found-error",
  DatabaseError: "database-error",
  UniqueConstraintError: "unique-constraint-error",
  AuthError: "auth-error",
  UnauthorizedError: "unauthorized-error",
  ReCAPTCHAError: "recaptcha-error",
  StorageError: "storage-error",
  SharpError: "sharp-error",
  ImageConversionError: "image-conversion-error",
  MailerError: "mailer-error",
} as const;
export type ActionError = (typeof ActionError)[keyof typeof ActionError];

export function getErrorMessage(error: ActionError) {
  switch (error) {
    case ActionError.ValidationError:
      return "入力値に問題があります。";
    case ActionError.ParsingError:
      return "入力値を正しく処理できませんでした。";
    case ActionError.NotFoundError:
      return "データが見つかりません。";
    case ActionError.DatabaseError:
      return "データベースに問題が発生しました。";
    case ActionError.UniqueConstraintError:
      return "値が既に使われています。";
    case ActionError.AuthError:
      return "Auth.jsのエラー";
    case ActionError.UnauthorizedError:
      return "権限がありません。";
    case ActionError.ReCAPTCHAError:
      return "不正なリクエストです。";
    case ActionError.StorageError:
      return "ストレージに問題が発生しました。";
    case ActionError.SharpError:
      return "Sharpでエラーが発生しました。";
    case ActionError.ImageConversionError:
      return "画像を変換できませんでした。";
    case ActionError.MailerError:
      return "メールを送信できませんでした。";
    default:
      return "予期せぬエラーが発生しました。";
  }
}
