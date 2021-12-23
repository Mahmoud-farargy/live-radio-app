import React from 'react';
import Modal from '../Modal';
import { trimText } from '../../../utilities/tools';
import { ShareSocial } from 'react-share-social';

function ShareList(props) {
    const { listName, setSocialModalOpenning, isSocialModalOpen, listLink } = props;
    const style = {
        background: 'var(--ultra-white)',
        borderRadius: 3,
        border: 0,
        color: 'white',
        padding: '2rem 30px',
      };
    return (
        <Modal label={listName ? `Share "${trimText(listName, 20)}" list with someone` : ""} isDismissible={true} isModalOpen={isSocialModalOpen} onModalChange={setSocialModalOpenning}>
            <div id="shareList">
                <ShareSocial
                    style={style}
                    url={listLink}
                    socialTypes={['facebook', 'twitter', 'reddit', 'linkedin', "email", "line"]}
                />
            </div>
        </Modal>
    )
}
export default ShareList