"use server";

import { redirect } from "next/navigation";
import type { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { Logger } from "@/lib/logger";
import { send } from "@/lib/mailer";
import { applications, tours } from "@/lib/db/schema";
import { Locale } from "@/lib/i18n";
import type { Tour } from "@/lib/core/tour";
import { formAction } from "@/lib/action";
import { ActionError } from "@/lib/action/error";
import { createApplicationSchema } from "./schema";

const logger = new Logger();

export const createApplication = formAction(
  _createApplication,
  createApplicationSchema,
  true,
);
async function _createApplication(
  data: z.infer<typeof createApplicationSchema>,
) {
  let tour: (Tour & { notifyTo?: string }) | undefined;
  try {
    tour = await db.query.tours.findFirst({
      where: eq(tours.id, data.tourId),
    });
    if (!tour) {
      return { data, count: -1, error: ActionError.NotFoundError };
    }
  } catch (e) {
    logger.error(e);
    return { data, count: -1, error: ActionError.DatabaseError };
  }

  try {
    await db.insert(applications).values(data);
  } catch (e) {
    logger.error(e);
    return { data, count: -1, error: ActionError.DatabaseError };
  }

  try {
    const replyMail = replyMails(data, tour);
    const notificationMail = notificationMails(data, tour);
    await Promise.all([
      send({
        to: data.email,
        from: process.env.EMAIL_FROM,
        subject: replyMail.subject,
        text: replyMail.text,
      }),
      send({
        to: tour.notifyTo,
        from: process.env.EMAIL_FROM,
        subject: notificationMail.subject,
        text: notificationMail.text,
      }),
    ]);
  } catch (e) {
    logger.error(e);
    return { data, count: -1, error: ActionError.MailerError };
  }

  return {
    data,
    count: 1,
    redirect: `/${data.locale}/tour/${tour.slug}/thanks`,
    error: null,
  };
  // redirect(`/${data.locale}/tour/${tour.slug}/thanks`);
}

function replyMails(data: z.infer<typeof createApplicationSchema>, tour: Tour) {
  switch (data.locale) {
    case Locale.JA:
      return {
        subject: "ツアーへのお申し込みありがとうございます",
        text: `
この度は【${tour.name}】へお申し込みくださり誠にありがとうございます。
内容を確認して担当者がご連絡いたしますので、今しばらくお待ちください。

== お申し込み内容 ====================

ツアー： ${tour.name}

ご希望日： ${data.date}

人数： ${data.participants}名

代表者： ${data.representative}

参加者：
${data.participantsDetails}

メールアドレス： ${data.email}

電話番号： ${data.tel || ""}

その他：
${data.remarks || ""}

======================================

※ このメールはご予約を確定するものではありません

--
TAKASAKI TOURS
https://tours.yanagawa.one
`,
      };
    case Locale.EN:
      return {
        subject: "Thank you for your tour application",
        text: `
Thank you very much for applying to [${tour.name}].
Our staff will review your application and contact you shortly. Please wait for our response.

== Application Details ====================

Tour: ${tour.name}

Preferred Date: ${data.date}

Number of Participants: ${data.participants}

Representative: ${data.representative}

Participants:
${data.participantsDetails}

Email: ${data.email}

Phone: ${data.tel || ""}

Additional Notes:
${data.remarks || ""}

===========================================

* This email does not confirm your reservation.

--
TAKASAKI TOURS
https://tours.yanagawa.one
`,
      };
    case Locale.ZH_HANS:
      return {
        subject: "感谢您报名参加旅游",
        text: `
感谢您报名参加【${tour.name}】。
工作人员将确认内容后与您联系，请稍候。

== 报名内容 ====================

旅游行程：${tour.name}

期望日期：${data.date}

人数：${data.participants}人

代表：${data.representative}

参加者：
${data.participantsDetails}

电子邮箱：${data.email}

电话号码：${data.tel || ""}

其他：
${data.remarks || ""}

================================

※ 本邮件不作为预约确认

--
TAKASAKI TOURS
https://tours.yanagawa.one
`,
      };
    case Locale.ZH_HANT:
      return {
        subject: "感謝您報名參加旅遊",
        text: `
感謝您報名參加【${tour.name}】。
工作人員將確認內容後與您聯繫，請稍候。

== 報名內容 ====================

旅遊行程：${tour.name}

期望日期：${data.date}

人數：${data.participants}人

代表：${data.representative}

參加者：
${data.participantsDetails}

電子郵箱：${data.email}

電話號碼：${data.tel || ""}

其他：
${data.remarks || ""}

================================

※ 本郵件不作為預約確認

--
TAKASAKI TOURS
https://tours.yanagawa.one
`,
      };
    default:
      throw new Error("Invalid Locale");
  }
}

function notificationMails(
  data: z.infer<typeof createApplicationSchema>,
  tour: Tour,
) {
  return {
    subject: "ツアーへの申し込みがありました",
    text: `
【${tour.name}】への申し込みがありました。
内容を確認して代表者に連絡してください。

== 申し込み内容 ====================

言語： ${data.locale}

ツアー： ${tour.name}

希望日： ${data.date}

人数： ${data.participants}名

代表者： ${data.representative}

参加者：
${data.participantsDetails}

メールアドレス： ${data.email}

電話番号： ${data.tel || ""}

その他：
${data.remarks || ""}

====================================

--
TAKASAKI TOURS
https://tours.yanagawa.one
`,
  };
}
