import React, { Fragment, useEffect, useState, memo } from "react";
import Carousel from "react-items-carousel";
import Loader from "react-loader-spinner";
import SlidableListItem from "./SlidableListItem/SlidableListItem";
import PropTypes from "prop-types";
import { withStationsFetcher } from "../../components/HOC/withStationsFetcher";
import { useHistory } from "react-router-dom";
import * as Consts from "../../utilities/consts";
import {  IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from "react-icons/io";
import { serialize } from "../../utilities/tools";

const SlidableList = ({params, fetchStations, listTitle}) => {
    const [itemsPerSide, setItemsPerSlide] = useState(6);
    const [activeItemIndex, setActiveItemIndex] = useState(0);
    const [listName, setListName] = useState("");
    const [response, setResponse] = useState([]);
    // const list = useStationsFetcher({...params, limit: 8});
    const history = useHistory();

    useEffect(() => { 
        if (params && typeof params === "object") {
          setResponse({
              ...response,
              loading: true
          });
          fetchStations({...params, limit: 8}).then((res) => {
              console.log(res);
              setResponse({
                  list: res,
                  loading: false
              });
          }).catch(() => {
              setResponse({
                  ...response,
                  loading: false
              });
          });
      }

        setListName(params?.tag ? params.tag : "");
        const currWidth = +window.innerWidth || +document.documentElement.clientWidth;
        // Responsive reel items count
        if (currWidth >= 3000) {
          // Large Desktop
          setItemsPerSlide(6);
        } else if (currWidth >= 1366) {
          // Laptop
          setItemsPerSlide(5);
        } else if (currWidth >= 1024) {
          // Tablet
          setItemsPerSlide(4);
        } else if (currWidth >= 464) {
          // Mobile
          setItemsPerSlide(3);
        } else if (currWidth >= 350) {
          // Small Mobile
          setItemsPerSlide(2);
        } else if (currWidth >= 250) {
          // Smaller Mobile
          setItemsPerSlide(1);
        } else {
          // Less than usual
          setItemsPerSlide(1);
        }
    }, []);
    const directMeToCategoryPage = ( ) => {
      history.push(`${Consts.CATEGORY}?${serialize({...params})}`);
    }
    return (
        <Fragment>
           {response && response.list?.length > 0 &&
            <section id="slidableList">
                <div className="slidableList--header flex-row">
                    <h4 className="list--name">{ listTitle || listName}</h4>
                    <span className="see--all--btn" onClick={() => directMeToCategoryPage()}>See All</span>
                </div>
                <ul className="slidableList--ul">
                        <Carousel
                            requestToChangeActive={setActiveItemIndex}
                            activeItemIndex={activeItemIndex}
                            numberOfCards={itemsPerSide}
                            infiniteLoop={false}
                            firstAndLastGutter={true}
                            enablePlaceholder={true}
                            gutter={4}
                            disableSwipe={true}
                            outsideChevron={false}
                            slidesToScroll={3}
                            chevronWidth={25}
                            placeholderItem={
                              <Loader
                                type="TailSpin"
                                color="var(--light-black)"
                                height={60}
                                width={60} />
                            }
                            classes={{ wrapper: "items--wrapper", itemsWrapper: "items--inner--wrapper" }}
                            rightChevron={<button aria-label="Scroll right" className="slidablelist--right--arrow">
                              <IoIosArrowDroprightCircle />
                            </button>}
                            leftChevron={<button aria-label="Scroll left" className="slidablelist--left--arrow">
                              <IoIosArrowDropleftCircle />
                            </button>}
                          >
                            {response.list?.map((item, i) => {
                            return item && (<SlidableListItem key={item.stationuuid || i} item={item} wholeList={response.list}/>)
                            })}
                        </Carousel>
              
                </ul>
            </section>
            }
        </Fragment>
    )
};
SlidableList.propTypes = {
    params: PropTypes.object.isRequired,
    fetchStations: PropTypes.func.isRequired,
    listTitle: PropTypes.string,
}
SlidableList.defaultProps = {
    params: {}
}
export default withStationsFetcher(memo(SlidableList));