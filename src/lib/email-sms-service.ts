/**
 * Email & SMS Service
 * 
 * This module provides email and SMS notification functionality.
 * Integrates with SendGrid for email and Twilio for SMS.
 */

// ============================================================================
// Types
// ============================================================================

/**
 * Email template types
 */
export type EmailTemplate = 
  | 'welcome'
  | 'email_verification'
  | 'password_reset'
  | 'job_posted'
  | 'bid_received'
  | 'bid_accepted'
  | 'bid_rejected'
  | 'payment_received'
  | 'payment_sent'
  | 'job_completed'
  | 'rating_received'
  | 'territory_claimed'
  | 'account_notification'
  | 'marketing';

/**
 * SMS template types
 */
export type SMSTemplate =
  | 'verification_code'
  | 'bid_received'
  | 'bid_accepted'
  | 'payment_received'
  | 'job_reminder'
  | 'urgent_alert';

/**
 * Email options
 */
export interface EmailOptions {
  to: string | string[];
  template: EmailTemplate;
  subject?: string;
  data: Record<string, unknown>;
  attachments?: EmailAttachment[];
  replyTo?: string;
}

/**
 * Email attachment
 */
export interface EmailAttachment {
  filename: string;
  content: string | Buffer;
  type: string;
}

/**
 * SMS options
 */
export interface SMSOptions {
  to: string;
  template: SMSTemplate;
  data: Record<string, unknown>;
}

/**
 * Send result
 */
export interface SendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// ============================================================================
// Email Templates
// ============================================================================

const emailTemplates: Record<EmailTemplate, { subject: string; content: string }> = {
  welcome: {
    subject: 'Welcome to FairTradeWorker!',
    content: `
      <h1>Welcome to FairTradeWorker, {{name}}!</h1>
      <p>Thank you for joining the revolutionary home services marketplace.</p>
      <p>As a {{role}}, you'll enjoy:</p>
      <ul>
        {{#if isContractor}}
        <li>Zero platform fees - keep 100% of your earnings</li>
        <li>AI-powered job matching</li>
        <li>Route optimization tools</li>
        {{/if}}
        {{#if isHomeowner}}
        <li>AI-powered job scope generation</li>
        <li>Verified, licensed contractors</li>
        <li>Secure escrow payments</li>
        {{/if}}
        {{#if isOperator}}
        <li>Territory-based operations</li>
        <li>Zero ongoing fees</li>
        <li>Build your contractor network</li>
        {{/if}}
      </ul>
      <p><a href="{{dashboardUrl}}">Go to your dashboard</a></p>
    `,
  },
  
  email_verification: {
    subject: 'Verify your email address',
    content: `
      <h1>Verify your email</h1>
      <p>Hi {{name}},</p>
      <p>Please click the button below to verify your email address:</p>
      <p><a href="{{verificationUrl}}" style="padding: 12px 24px; background: #0ea5e9; color: white; text-decoration: none; border-radius: 8px;">Verify Email</a></p>
      <p>Or copy this link: {{verificationUrl}}</p>
      <p>This link expires in 24 hours.</p>
    `,
  },
  
  password_reset: {
    subject: 'Reset your password',
    content: `
      <h1>Password Reset Request</h1>
      <p>Hi {{name}},</p>
      <p>We received a request to reset your password. Click the button below:</p>
      <p><a href="{{resetUrl}}" style="padding: 12px 24px; background: #0ea5e9; color: white; text-decoration: none; border-radius: 8px;">Reset Password</a></p>
      <p>This link expires in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  },
  
  job_posted: {
    subject: 'Your job has been posted!',
    content: `
      <h1>Job Posted Successfully</h1>
      <p>Hi {{name}},</p>
      <p>Your job "{{jobTitle}}" has been posted and is now visible to contractors.</p>
      <p><strong>Estimated Cost:</strong> \${{estimatedCostMin}} - \${{estimatedCostMax}}</p>
      <p><strong>Location:</strong> {{location}}</p>
      <p>You'll receive notifications as contractors submit bids.</p>
      <p><a href="{{jobUrl}}">View Job Details</a></p>
    `,
  },
  
  bid_received: {
    subject: 'New bid received for your job',
    content: `
      <h1>New Bid Received</h1>
      <p>Hi {{name}},</p>
      <p>{{contractorName}} has submitted a bid for "{{jobTitle}}".</p>
      <p><strong>Bid Amount:</strong> \${{bidAmount}}</p>
      <p><strong>Contractor Rating:</strong> {{contractorRating}}/5 stars</p>
      <p><strong>Completed Jobs:</strong> {{completedJobs}}</p>
      <p><a href="{{bidUrl}}">Review Bid</a></p>
    `,
  },
  
  bid_accepted: {
    subject: 'Your bid has been accepted!',
    content: `
      <h1>Congratulations! Bid Accepted</h1>
      <p>Hi {{name}},</p>
      <p>Your bid of \${{bidAmount}} for "{{jobTitle}}" has been accepted!</p>
      <p><strong>Client:</strong> {{clientName}}</p>
      <p><strong>Location:</strong> {{location}}</p>
      <p><strong>Start Date:</strong> {{startDate}}</p>
      <p><a href="{{jobUrl}}">View Job Details</a></p>
      <p>Remember: You keep 100% of your earnings. Zero platform fees!</p>
    `,
  },
  
  bid_rejected: {
    subject: 'Update on your bid',
    content: `
      <h1>Bid Update</h1>
      <p>Hi {{name}},</p>
      <p>Unfortunately, your bid for "{{jobTitle}}" was not selected this time.</p>
      <p>Don't worry - there are plenty of other opportunities!</p>
      <p><a href="{{jobsUrl}}">Browse More Jobs</a></p>
    `,
  },
  
  payment_received: {
    subject: 'Payment received - ${{amount}}',
    content: `
      <h1>Payment Received</h1>
      <p>Hi {{name}},</p>
      <p>You've received a payment of <strong>\${{amount}}</strong> for "{{jobTitle}}".</p>
      <p><strong>Platform Fee:</strong> $0 (Zero fees!)</p>
      <p><strong>You Received:</strong> \${{amount}} (100%)</p>
      <p>Funds are available in your account.</p>
      <p><a href="{{earningsUrl}}">View Earnings</a></p>
    `,
  },
  
  payment_sent: {
    subject: 'Payment confirmed - ${{amount}}',
    content: `
      <h1>Payment Confirmed</h1>
      <p>Hi {{name}},</p>
      <p>Your payment of <strong>\${{amount}}</strong> for "{{jobTitle}}" has been processed.</p>
      <p><strong>Contractor:</strong> {{contractorName}}</p>
      <p><strong>Receipt ID:</strong> {{receiptId}}</p>
      <p><a href="{{receiptUrl}}">View Receipt</a></p>
    `,
  },
  
  job_completed: {
    subject: 'Job completed - Please leave a review',
    content: `
      <h1>Job Completed</h1>
      <p>Hi {{name}},</p>
      <p>"{{jobTitle}}" has been marked as completed by {{contractorName}}.</p>
      <p>Please take a moment to leave a review:</p>
      <p><a href="{{reviewUrl}}" style="padding: 12px 24px; background: #22c55e; color: white; text-decoration: none; border-radius: 8px;">Leave Review</a></p>
    `,
  },
  
  rating_received: {
    subject: 'You received a {{rating}}-star review!',
    content: `
      <h1>New Review Received</h1>
      <p>Hi {{name}},</p>
      <p>{{clientName}} left you a {{rating}}-star review for "{{jobTitle}}".</p>
      <p><strong>Review:</strong> "{{reviewText}}"</p>
      <p>Your overall rating is now {{overallRating}}/5 stars.</p>
      <p><a href="{{profileUrl}}">View Your Profile</a></p>
    `,
  },
  
  territory_claimed: {
    subject: 'Territory claimed successfully!',
    content: `
      <h1>Territory Claimed</h1>
      <p>Hi {{name}},</p>
      <p>Congratulations! You've successfully claimed:</p>
      <p><strong>{{territoryName}}</strong></p>
      <p><strong>ZIP Codes:</strong> {{zipCodes}}</p>
      <p><strong>Price:</strong> {{price}}</p>
      <p>Remember: You pay $0 ongoing fees. Start building your contractor network!</p>
      <p><a href="{{territoryUrl}}">Manage Territory</a></p>
    `,
  },
  
  account_notification: {
    subject: '{{subject}}',
    content: `
      <h1>{{title}}</h1>
      <p>Hi {{name}},</p>
      <p>{{message}}</p>
      {{#if actionUrl}}
      <p><a href="{{actionUrl}}">{{actionLabel}}</a></p>
      {{/if}}
    `,
  },
  
  marketing: {
    subject: '{{subject}}',
    content: `
      <h1>{{title}}</h1>
      {{content}}
      <hr>
      <p style="font-size: 12px; color: #666;">
        You're receiving this because you opted in to marketing emails.
        <a href="{{unsubscribeUrl}}">Unsubscribe</a>
      </p>
    `,
  },
};

// ============================================================================
// SMS Templates
// ============================================================================

const smsTemplates: Record<SMSTemplate, string> = {
  verification_code: 'Your FairTradeWorker verification code is: {{code}}. Valid for 10 minutes.',
  
  bid_received: 'New bid of ${{amount}} received for "{{jobTitle}}" from {{contractorName}}. Open app to review.',
  
  bid_accepted: 'Congrats! Your ${{amount}} bid for "{{jobTitle}}" was accepted. Check app for details.',
  
  payment_received: 'Payment received: ${{amount}} for "{{jobTitle}}". You keep 100% - $0 fees!',
  
  job_reminder: 'Reminder: Your job "{{jobTitle}}" starts in {{timeUntil}}. Location: {{address}}',
  
  urgent_alert: 'URGENT: {{message}}. Please check the FairTradeWorker app immediately.',
};

// ============================================================================
// Template Rendering
// ============================================================================

/**
 * Render a template with data
 */
function renderTemplate(template: string, data: Record<string, unknown>): string {
  let result = template;
  
  // Simple variable replacement
  Object.entries(data).forEach(([key, value]) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(regex, String(value ?? ''));
  });
  
  // Simple conditional handling
  result = result.replace(
    /\{\{#if (\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
    (_, key, content) => (data[key] ? content : '')
  );
  
  return result;
}

/**
 * Wrap email content in base template
 */
function wrapEmailTemplate(content: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>FairTradeWorker</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        h1 { color: #0ea5e9; }
        a { color: #0ea5e9; }
        .button { display: inline-block; padding: 12px 24px; background: #0ea5e9; color: white !important; text-decoration: none; border-radius: 8px; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        ${content}
        <div class="footer">
          <p>FairTradeWorker - Death of the Middleman</p>
          <p>Zero fees for contractors. 100% of earnings kept.</p>
          <p><a href="https://fairtradeworker.com">fairtradeworker.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// ============================================================================
// Send Functions
// ============================================================================

/**
 * Send an email
 */
export async function sendEmail(options: EmailOptions): Promise<SendResult> {
  const { to, template, subject: customSubject, data, attachments, replyTo } = options;
  
  const templateData = emailTemplates[template];
  if (!templateData) {
    return { success: false, error: `Unknown template: ${template}` };
  }
  
  const subject = customSubject || renderTemplate(templateData.subject, data);
  const content = renderTemplate(templateData.content, data);
  const html = wrapEmailTemplate(content);
  
  // In production, this would send via SendGrid or similar
  console.log('[Email] Would send:', {
    to,
    subject,
    template,
    data,
  });
  
  // Simulate API call
  // const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     personalizations: [{ to: Array.isArray(to) ? to.map(email => ({ email })) : [{ email: to }] }],
  //     from: { email: 'noreply@fairtradeworker.com', name: 'FairTradeWorker' },
  //     reply_to: replyTo ? { email: replyTo } : undefined,
  //     subject,
  //     content: [{ type: 'text/html', value: html }],
  //     attachments: attachments?.map(a => ({
  //       content: typeof a.content === 'string' ? a.content : a.content.toString('base64'),
  //       filename: a.filename,
  //       type: a.type,
  //     })),
  //   }),
  // });
  
  return {
    success: true,
    messageId: `email_${Date.now()}`,
  };
}

/**
 * Send an SMS
 */
export async function sendSMS(options: SMSOptions): Promise<SendResult> {
  const { to, template, data } = options;
  
  const templateStr = smsTemplates[template];
  if (!templateStr) {
    return { success: false, error: `Unknown template: ${template}` };
  }
  
  const message = renderTemplate(templateStr, data);
  
  // In production, this would send via Twilio or similar
  console.log('[SMS] Would send:', {
    to,
    message,
    template,
  });
  
  // Simulate API call
  // const client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
  // const result = await client.messages.create({
  //   body: message,
  //   from: process.env.TWILIO_PHONE,
  //   to,
  // });
  
  return {
    success: true,
    messageId: `sms_${Date.now()}`,
  };
}

/**
 * Generate a cryptographically secure verification code
 */
function generateSecureCode(length: number = 6): string {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  const code = (array[0] % Math.pow(10, length)).toString().padStart(length, '0');
  return code;
}

/**
 * Send a verification code via SMS
 */
export async function sendVerificationCode(phone: string): Promise<{ success: boolean; code?: string; error?: string }> {
  const code = generateSecureCode(6);
  
  const result = await sendSMS({
    to: phone,
    template: 'verification_code',
    data: { code },
  });
  
  if (result.success) {
    return { success: true, code };
  }
  
  return { success: false, error: result.error };
}

// ============================================================================
// Batch Sending
// ============================================================================

/**
 * Send emails in batch
 */
export async function sendBatchEmails(emails: EmailOptions[]): Promise<SendResult[]> {
  const results = await Promise.all(emails.map(sendEmail));
  return results;
}

/**
 * Send SMS in batch
 */
export async function sendBatchSMS(messages: SMSOptions[]): Promise<SendResult[]> {
  const results = await Promise.all(messages.map(sendSMS));
  return results;
}

// ============================================================================
// Preferences
// ============================================================================

/**
 * Email preferences
 */
export interface EmailPreferences {
  marketing: boolean;
  jobUpdates: boolean;
  bidNotifications: boolean;
  paymentNotifications: boolean;
  weeklyDigest: boolean;
}

/**
 * SMS preferences
 */
export interface SMSPreferences {
  enabled: boolean;
  urgentOnly: boolean;
  bidNotifications: boolean;
  paymentNotifications: boolean;
}

/**
 * Get default email preferences
 */
export function getDefaultEmailPreferences(): EmailPreferences {
  return {
    marketing: false,
    jobUpdates: true,
    bidNotifications: true,
    paymentNotifications: true,
    weeklyDigest: true,
  };
}

/**
 * Get default SMS preferences
 */
export function getDefaultSMSPreferences(): SMSPreferences {
  return {
    enabled: false,
    urgentOnly: true,
    bidNotifications: false,
    paymentNotifications: true,
  };
}

export default {
  sendEmail,
  sendSMS,
  sendVerificationCode,
  sendBatchEmails,
  sendBatchSMS,
  getDefaultEmailPreferences,
  getDefaultSMSPreferences,
};
