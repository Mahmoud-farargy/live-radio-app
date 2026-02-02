import React, { useEffect } from "react"
import Modal from "../Modal"
import appInfo from "../../../info/app-config.json"
import {
  EmailShareButton,
  FacebookShareButton,
  LineShareButton,
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailIcon,
  FacebookIcon,
  RedditIcon,
  TelegramIcon,
  XIcon,
  LineIcon,
  WhatsappIcon,
} from "react-share"
import { useTranslation } from "react-i18next"

function ShareList(props) {
  const { t } = useTranslation()
  const { listName, setSocialModalOpening, isSocialModalOpen, shareUrl } =
    props
  const shareTitle = appInfo.title

  useEffect(() => {
    const allShareButtons = document.querySelectorAll(".Demo__some-network__share-button");
    allShareButtons?.forEach((btn) => {
      btn.classList.remove("react-share__ShareButton");
    })
  }, [isSocialModalOpen]);

  return (
    <Modal
      label={listName ? `${t("share_list.title.pt1")} "${listName}"` : ""}
      isDismissible={true}
      isModalOpen={isSocialModalOpen}
      onModalChange={setSocialModalOpening}
    >
      <div id="shareList">
        <FacebookShareButton
          url={shareUrl}
          className="Demo__some-network__share-button"
        >
          <FacebookIcon size={42} round />
        </FacebookShareButton>

        <TwitterShareButton
          url={shareUrl}
          title={shareTitle}
          className="Demo__some-network__share-button"
        >
          <XIcon size={42} round />
        </TwitterShareButton>
        <RedditShareButton
          url={shareUrl}
          title={shareTitle}
          windowWidth={660}
          windowHeight={460}
          className="Demo__some-network__share-button"
        >
          <RedditIcon size={42} round />
        </RedditShareButton>
        <EmailShareButton
          url={shareUrl}
          subject={shareTitle}
          body="body"
          className="Demo__some-network__share-button"
        >
          <EmailIcon size={42} round />
        </EmailShareButton>
        <LineShareButton
          url={shareUrl}
          title={shareTitle}
          className="Demo__some-network__share-button"
        >
          <LineIcon size={42} round />
        </LineShareButton>

        <WhatsappShareButton
          url={shareUrl}
          title={shareTitle}
          separator=":: "
          className="Demo__some-network__share-button"
        >
          <WhatsappIcon size={42} round />
        </WhatsappShareButton>
        <TelegramShareButton
          url={shareUrl}
          title={shareTitle}
          className="Demo__some-network__share-button"
        >
          <TelegramIcon size={42} round />
        </TelegramShareButton>
      </div>
    </Modal>
  )
}
export default ShareList
