import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Linking,
  Alert,
  SafeAreaView,
} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import {IconType} from '../../helper/Constants';
import {getMagazineDetail} from '../../Actions/RoseBowlActions';
import ProgresImage from '../../component/ProgresImage';

let magazineId = null;
let editorContact = null;
let editorialBoard = null;

const Summary = ({route, navigation}) => {
  if (route.params !== undefined && route.params !== null) {
    if (
      route.params.magazineId !== undefined &&
      route.params.magazineId !== null
    ) {
      magazineId = route.params.magazineId;
    }
  }

  const [pageContent, setPageContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showEditorContact, setShowEditorContact] = useState(false);
  const [showEditorialBoard, setShowEditorialBoard] = useState(false);

  useEffect(() => {
    if (magazineId !== null) {
      getMagazine();
    }
    return () => {};
  }, []);

  /**
   * ************************************************
   * API Section Start
   * ************************************************
   */

  const getMagazine = () => {
    setIsLoading(true);
    getMagazineDetail(
      magazineId,
      (response) => {
        setIsLoading(false);
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            if (data.status) {
              if (
                data.data &&
                data.data !== undefined &&
                data.data !== null &&
                data.data.length > 0
              ) {
                let tableContent = data.data[0].tableOfContents;
                if (tableContent !== null && tableContent !== undefined) {
                  tableContent.sort((a, b) => (a.seqid > b.seqid ? 1 : -1));
                }
                data.data[0].tableOfContents = tableContent;
                setPageContent(data.data[0]);
              } else {
                setPageContent(null);
              }
            } else {
              setPageContent(null);
            }
          }
        }
      },
      (error) => {
        setIsLoading(false);
        console.log('error', error);
      },
    );
  };

  /*
   * ************************************************
   * API Section End
   * ************************************************
   */

  const openEmail = (email) => {
    if (email !== undefined && email !== null && email !== '') {
      Linking.openURL(`mailto:${email}`);
    }
  };

  const openLink = (link) => {
    if (link !== undefined && link !== null && link !== '') {
      console.log('link', link);
      Linking.canOpenURL(link).then((status) => {
        if (status) {
          Linking.openURL(link);
        } else {
          Alert.alert('Invalid link!');
        }
      });
    }
  };

  const generateDetails = (childId, tableOfContents) => {
    let contentDetails = [];
    let count = 0;
    let isFound = false;

    tableOfContents.map((content) => {
      content.data.map((data) => {
        let object = {
          header: data.title,
          subTitle: data.subTitle,
          body: data.body,
          shareLink:
            content.shareLink && content.shareLink !== undefined
              ? content.shareLink
              : 'https://apiwobs.alumbus.com/indexing/20?article=116',
        };
        contentDetails.push(object);
        if (data._id.toString() === childId.toString()) {
          count = count;
          isFound = true;
        }

        if (!isFound) {
          count++;
        }
      });
    });

    navigation.navigate('MagazineDetails', {
      data: contentDetails,
      currentIndex: count,
    });
  };

  return (
    <View style={GlobalInclude.AppStyle.topSpace}>
      <SafeAreaView style={GlobalInclude.AppStyle.fill}>
        <View style={GlobalInclude.AppStyle.parentStyle}>
          <View
            style={[
              GlobalInclude.AppStyle.fill,
              {
                paddingBottom: scale(5),
              },
            ]}>
            {isLoading ? (
              <View style={GlobalInclude.AppStyle.fillCenter}>
                <ActivityIndicator
                  size={'small'}
                  color={GlobalInclude.Color.ColorPrimary}
                />
              </View>
            ) : (
              <View style={GlobalInclude.AppStyle.fill}>
                {pageContent === null || pageContent.length === 0 ? (
                  <View style={GlobalInclude.AppStyle.fillCenter}>
                    <Image
                      style={{height: scale(100), width: scale(100)}}
                      source={GlobalInclude.Assets.AppLogo}
                    />
                    <Text style={[g.colorGray8, g.FHNM, g.fs18]}>
                      No Content Found
                    </Text>
                  </View>
                ) : (
                  <View style={GlobalInclude.AppStyle.fill}>
                    <View
                      style={[
                        GlobalInclude.AppStyle.fill,
                        GlobalInclude.AppStyle.contentSpace,
                      ]}>
                      <View
                        style={[
                          grid.rowdir,
                          grid.alignItems,
                          grid.justifyContent,
                          g.mb10,
                        ]}>
                        <TouchableOpacity
                          onPress={() => navigation.goBack()}
                          style={grid.col}>
                          <GlobalInclude.BaseIcon
                            containerStyle={style.backIcon}
                            iconColor={GlobalInclude.Color.ColorPrimary}
                            iconName={'arrowleft'}
                            iconSize={scale(30)}
                            iconType={IconType[10]}
                          />
                        </TouchableOpacity>
                        <View
                          style={[
                            grid.col,
                            grid.alignItems,
                            grid.justifyContent,
                          ]}>
                          <Text
                            style={[
                              g.colorBlack,
                              g.fs18,
                              g.FHNB,
                              g.txtCenter,
                              grid.justifyContentCenter,
                              grid.alignItems,
                            ]}>
                            Contents
                          </Text>
                        </View>
                        <View style={grid.col} />
                      </View>
                      {/* Magazine */}
                      <ScrollView showsVerticalScrollIndicator={false}>
                        <View>
                          <ProgresImage
                            source={
                              pageContent.coverImage.file != null &&
                              pageContent.coverImage.file !== ''
                                ? {uri: pageContent.coverImage.file}
                                : GlobalInclude.Assets.DefaultImage
                            }
                            containerStyle={{
                              height: scale(105),
                              maxWidth: '100%',
                            }}
                            imageStyle={{
                              borderRadius: scale(13),
                            }}
                          />

                          {pageContent.tableOfContents !== null &&
                            pageContent.tableOfContents.length > 0 && (
                              <View style={g.mt20}>
                                {pageContent.tableOfContents.map(
                                  (item, index) => {
                                    return (
                                      <View
                                        style={[
                                          g.mb10,
                                          g.pb5,
                                          g.bb1,
                                          {borderBottomColor: '#7070701A'},
                                        ]}
                                        key={index}>
                                        <Text
                                          style={[
                                            g.colorBlack,
                                            g.fs16,
                                            g.FHNB,
                                          ]}>
                                          {item.title}
                                        </Text>
                                        {item.data !== null &&
                                          item.data.length > 0 && (
                                            <View style={g.mt5}>
                                              {item.data.map(
                                                (child, childIndex) => {
                                                  return (
                                                    <TouchableOpacity
                                                      onPress={() => {
                                                        generateDetails(
                                                          child._id,
                                                          pageContent.tableOfContents,
                                                        );
                                                      }}
                                                      key={childIndex}>
                                                      <Text
                                                        style={[
                                                          g.colorLightGray,
                                                          g.fs15,
                                                          g.FHNR,
                                                          g.mb5,
                                                        ]}>
                                                        {child.title}
                                                      </Text>
                                                    </TouchableOpacity>
                                                  );
                                                },
                                              )}
                                            </View>
                                          )}
                                      </View>
                                    );
                                  },
                                )}
                              </View>
                            )}
                          <View style={{height: 50}} />
                        </View>
                      </ScrollView>
                    </View>
                    {/* footer */}
                    <View
                      style={[
                        grid.rowdir,
                        grid.alignItems,
                        {
                          backgroundColor: 'rgba(230, 230, 230, 0.8)',
                          paddingTop: scale(9),
                          paddingBottom: scale(9),
                        },
                      ]}>
                      <TouchableOpacity
                        onPress={() => {
                          editorialBoard = pageContent.editorialBoard;
                          setShowEditorialBoard(true);
                        }}
                        activeOpacity={0.9}
                        style={[grid.col, g.bggray5, g.brc1, g.p7]}>
                        <Text
                          style={[g.fs14, g.FHNB, g.colorWhite, g.txtCenter]}>
                          The Editorial Board
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          editorContact = pageContent.contactTheEditor;
                          setShowEditorContact(true);
                        }}
                        activeOpacity={0.9}
                        style={[grid.col, g.bggray5, g.p7]}>
                        <Text
                          style={[g.fs14, g.FHNB, g.colorWhite, g.txtCenter]}>
                          Contact The Editor
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Footer options */}
                    {/* Contact Editor */}
                    <Modal
                      animationType="fade"
                      transparent={true}
                      visible={showEditorContact}
                      onRequestClose={() => {
                        setShowEditorContact(false);
                      }}>
                      <View style={[g.bgBlack08, g.p10, {flex: 1}]}>
                        <View style={[grid.row, grid.alignItems]}>
                          <ScrollView>
                            <View style={[g.bgWhite, g.p10, g.br3]}>
                              <View
                                style={[
                                  grid.justifyContent,
                                  grid.rowdir,
                                  g.mb15,
                                  grid.alignItems,
                                ]}>
                                <Text
                                  style={[
                                    g.fs14,
                                    g.colorGray,
                                    g.FHNB,
                                    grid.justifyContentCenter,
                                    grid.alignItems,
                                  ]}>
                                  CONTACT THE EDITOR
                                </Text>
                                <TouchableOpacity
                                  activeOpacity={1}
                                  onPress={() => setShowEditorContact(false)}>
                                  <GlobalInclude.BaseIcon
                                    containerStyle={style.closeIcon}
                                    iconColor={'#808080'}
                                    iconName={'close'}
                                    iconSize={scale(24)}
                                    iconType={IconType[4]}
                                  />
                                </TouchableOpacity>
                              </View>
                              <View>
                                <TouchableOpacity
                                  activeOpacity={1}
                                  style={[
                                    g.inputWhite,
                                    g.mt10,
                                    grid.rowdir,
                                    grid.alignItems,
                                  ]}
                                  onPress={() =>
                                    openEmail(editorContact.email)
                                  }>
                                  <View
                                    style={[
                                      grid.rowrow,
                                      grid.alignItems,
                                      grid.col,
                                    ]}>
                                    <GlobalInclude.BaseIcon
                                      containerStyle={style.downloadIcon}
                                      iconColor={'#6e6e6e'}
                                      iconName={'envelope'}
                                      iconSize={scale(20)}
                                      iconType={IconType[4]}
                                    />
                                    <Text
                                      style={[
                                        g.fs14,
                                        g.FHNR,
                                        g.colorGray,
                                        g.ml15,
                                        grid.justifyContentCenter,
                                      ]}>
                                      {editorContact !== null &&
                                        editorContact.email}
                                    </Text>
                                  </View>
                                  <GlobalInclude.BaseIcon
                                    containerStyle={style.downloadIcon}
                                    iconColor={'#6e6e6e'}
                                    iconName={'arrow-right'}
                                    iconSize={scale(20)}
                                    iconType={IconType[4]}
                                  />
                                </TouchableOpacity>
                                <TouchableOpacity
                                  activeOpacity={1}
                                  style={[
                                    g.inputWhite,
                                    g.mt10,
                                    grid.rowdir,
                                    grid.alignItems,
                                  ]}
                                  onPress={() =>
                                    openLink(editorContact.webLink)
                                  }>
                                  <View
                                    style={[
                                      grid.rowrow,
                                      grid.alignItems,
                                      grid.col,
                                    ]}>
                                    <GlobalInclude.BaseIcon
                                      containerStyle={style.downloadIcon}
                                      iconColor={'#6e6e6e'}
                                      iconName={'link'}
                                      iconSize={scale(20)}
                                      iconType={IconType[4]}
                                    />
                                    <Text
                                      style={[
                                        g.fs14,
                                        g.FHNR,
                                        g.colorGray,
                                        g.ml15,
                                      ]}>
                                      {editorContact !== null &&
                                        editorContact.webLink}
                                    </Text>
                                  </View>
                                  <GlobalInclude.BaseIcon
                                    containerStyle={style.downloadIcon}
                                    iconColor={'#6e6e6e'}
                                    iconName={'arrow-right'}
                                    iconSize={scale(20)}
                                    iconType={IconType[4]}
                                  />
                                </TouchableOpacity>
                              </View>
                            </View>
                          </ScrollView>
                        </View>
                      </View>
                    </Modal>

                    {/* Editorial Board */}
                    <Modal
                      animationType="fade"
                      transparent={true}
                      visible={showEditorialBoard}
                      onRequestClose={() => {
                        setShowEditorialBoard(false);
                      }}>
                      <View style={[g.bgBlack08, g.p10, {flex: 1}]}>
                        <View style={[grid.row, grid.alignItems]}>
                          <ScrollView>
                            <View style={[g.bgWhite, g.p10, g.br3]}>
                              <View
                                style={[
                                  grid.justifyContent,
                                  grid.rowdir,
                                  g.mb15,
                                  grid.alignItems,
                                ]}>
                                <Text
                                  style={[
                                    g.fs14,
                                    g.colorGray,
                                    g.FHNB,
                                    grid.justifyContentCenter,
                                    grid.alignItems,
                                  ]}>
                                  THE EDITORIAL BOARD
                                </Text>
                                <TouchableOpacity
                                  activeOpacity={1}
                                  onPress={() => setShowEditorialBoard(false)}
                                  hitSlop={{
                                    top: 5,
                                    bottom: 20,
                                    left: 5,
                                    right: 20,
                                  }}>
                                  <GlobalInclude.BaseIcon
                                    containerStyle={style.closeIcon}
                                    iconColor={'#808080'}
                                    iconName={'close'}
                                    iconSize={scale(24)}
                                    iconType={IconType[4]}
                                  />
                                </TouchableOpacity>
                              </View>
                              <View style={g.mt10}>
                                {editorialBoard !== null &&
                                  editorialBoard.map((item) => {
                                    return (
                                      <View style={g.mb10}>
                                        <Text
                                          style={[
                                            g.fs12,
                                            g.FHNR,
                                            g.colorGray2,
                                          ]}>
                                          {item.title}
                                        </Text>
                                        <Text
                                          style={[
                                            g.fs12,
                                            g.FHNB,
                                            g.colorGray,
                                            g.ml5,
                                            g.mt5,
                                          ]}>
                                          {item.value}
                                        </Text>
                                      </View>
                                    );
                                  })}
                              </View>
                            </View>
                          </ScrollView>
                        </View>
                      </View>
                    </Modal>
                    {/* Footer options */}
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const style = StyleSheet.create({
  backIcon: {
    height: scale(39),
    width: scale(39),
  },
  downloadIcon: {
    height: scale(24),
    width: scale(24),
  },
  closeIcon: {
    height: scale(30),
    width: scale(30),
  },
});

export default Summary;
