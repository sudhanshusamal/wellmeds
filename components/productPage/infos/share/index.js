import { EmailIcon, EmailShareButton, FacebookIcon, FacebookMessengerIcon, FacebookMessengerShareButton, FacebookShareButton, InstapaperIcon, InstapaperShareButton, LinkedinIcon, LinkedinShareButton, PinterestIcon, PinterestShareButton, RedditIcon, RedditShareButton, TelegramIcon, TelegramShareButton, TwitterIcon, TwitterShareButton, WhatsappIcon, WhatsappShareButton } from 'react-share'
import styles from './styles.module.scss'

export default function Share() {
  return (
    <div className={styles.share}>
      <FacebookShareButton url={window?.location.href}>
        <FacebookIcon size={38} />
      </FacebookShareButton>
      <TwitterShareButton url={window?.location.href}>
        <TwitterIcon size={38} />
      </TwitterShareButton>
      <TelegramShareButton url={window?.location.href}>
        <TelegramIcon size={38} />
      </TelegramShareButton>
      <WhatsappShareButton url={window?.location.href}>
        <WhatsappIcon size={38} />
      </WhatsappShareButton>
      <LinkedinShareButton url={window?.location.href}>
        <LinkedinIcon size={38} />
      </LinkedinShareButton>
      <RedditShareButton url={window?.location.href}>
        <RedditIcon size={38} />
      </RedditShareButton>
      <PinterestShareButton url={window?.location.href}>
        <PinterestIcon size={38} />
      </PinterestShareButton>
      <EmailShareButton url={window?.location.href}>
        <EmailIcon size={38} />
      </EmailShareButton>
      <FacebookMessengerShareButton url={window?.location.href}>
        <FacebookMessengerIcon size={38} />
      </FacebookMessengerShareButton>
    </div>
  )
}
