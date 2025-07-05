import styles from "./index.module.scss"
import {Button, Form, Input, message, Modal} from "antd";
import {textCopyToClipboard} from "@/utils/textUtils.ts";
import {useTranslation} from "react-i18next";
import {useEffect, useRef, useState} from "react";
import {APIAddUserWalletAddress, APIUserWalletAddressDelete, APIUserWalletAddressList} from "@/api";
import {LoadingOutlined} from "@ant-design/icons";
import {AddUserWalletReqType, UserWalletAddressReqType, UserWalletAddressType} from "@/types";
import {UserInfoDataType} from "@/redux/reducers/user/userInfo.ts";
import {useSelector} from "react-redux";
import useDispatchAction from "@/hooks/useDispatchAction.ts";
import {setLoadingModalVis} from "@/redux/actions/home.ts";
import {BAST_URL} from "@/config/appConfig.ts";

const CollectionPage = () => {
  const {t}: { t: (key: string, value?: any) => string }  = useTranslation()

  const dispatch = useDispatchAction({ setLoadingModalVis })

  const userInfoData: UserInfoDataType = useSelector((state: any) => state.user.userInfo.userInfo)

  const [form] = Form.useForm(null)

  const listLoadingRef = useRef(false)

  const [loadingStatus, setLoadingStatus] = useState(0)
  const [deleteDialogVis, setDeleteDialogVis] = useState(false)
  const listParamsRef = useRef({
    current: 1,
    size: 35
  })
  const [addressList, setAddressList] = useState<Array<UserWalletAddressType>>([])

  const [addressDetails, setAddressDetails] = useState<UserWalletAddressType>(null)

  const [imageKey, setImageKey] = useState(Date.now());
  const addressRules: any = [
    // {
    //   required: true,
    //   message: t('collection_input_address_error')
    // },
    {
      validator: (_, value: string) => {
        if (!value || value.trim() === '') {
          return Promise.reject(new Error(t('collection_input_address_error')));
        }
        return Promise.resolve();
      }
    }
  ]

  const codeRules: any = [
    // {
    //   required: true,
    //   message: t('collection_input_code_error')
    // },
    {
      validator: (_, value: string) => {
        if (!value || value.trim() === '') {
          return Promise.reject(new Error(t('collection_input_code_error')));
        }
        return Promise.resolve();
      }
    }
  ]

  const refreshImage = (e) => {
    e.stopPropagation()
    setImageKey(Date.now()); // 通过改变 key 刷新图片
  };


  const InputCodeWidget = ({value, onChange}: {value?: any, onChange?: (value: any) => void}) => {



    const onInputChange = (e) => {
      onChange?.(e.target.value)
    }



    return (
      <div className={styles.code_input_wrap}>
        <Input value={value} className={styles.input_wrap} onChange={onInputChange} />
        <div onClick={refreshImage} className={styles.code_box}><img src={BAST_URL + '/app-api/captcha/get' + '?' + imageKey} /></div>
      </div>
    )
  }

  const onFormFinish = (v) => {
    dispatch.setLoadingModalVis(true)
    const params: AddUserWalletReqType = {
      ...v,
      userId: userInfoData.userId,
    }
    APIAddUserWalletAddress(params).then(resp => {
      if (resp.code === 0) {
        message.success(t('common_operation_successful'))
        form.resetFields()
        listParamsRef.current.current = 1
        fetchData()
      } else {
        message.error(resp.msg)
      }
    }).finally(() => {
      dispatch.setLoadingModalVis(false)
    })
  }

  const onConfirmDeleteAddress = () => {
    dispatch.setLoadingModalVis(true)
    APIUserWalletAddressDelete(addressDetails.id).then(resp => {
      if (resp.code === 0) {
        // message.success(t('common_operation_successful'))
        // listParamsRef.current.current = 1
        // fetchData()
        const nowAddressList = addressList.filter(key => key.id !== addressDetails.id)
        setAddressList([...nowAddressList])
        setDeleteDialogVis(false)
      } else {
        message.error(resp.msg)
      }
    }).finally(() => {
      dispatch.setLoadingModalVis(false)
    })
  }

  const fetchData = () => {
    if (listLoadingRef.current) return
    listLoadingRef.current = true
    const params: UserWalletAddressReqType = {
      userId: userInfoData.userId,
      pageNo: listParamsRef.current.current,
      pageSize: listParamsRef.current.size
    }
    APIUserWalletAddressList(params).then(resp => {
      if (resp.code === 0) {
        if (resp.data.list.length <= 0) {
          setLoadingStatus(2)
          return
        }
        let nowList = addressList
        if (params.pageNo === 1) {
          nowList = []
        }
        nowList = nowList.concat(resp.data.list)
        setAddressList(nowList)
        if ((params.pageNo * params.pageSize) >= resp.data.list.length) {
          setLoadingStatus(2)
        }
        listParamsRef.current.current += 1
      } else {
        message.error(resp.msg)
      }
    }).finally(() => {
      listLoadingRef.current = false
    })
  }

  const initLoading = () => {
    const ob = new IntersectionObserver(() => {
      if (!listLoadingRef.current) {
        // console.log('执行了')
        fetchData()
      }
    }, {
      rootMargin: '0px',
      threshold: 0.5
    })
    const loadingMore = document.getElementById("moreLoading")
    if (loadingMore) {
      ob.observe(loadingMore)
    }
  }

  useEffect(() => {
    // fetchData()
    initLoading()
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.header_wrap}>
        <span>USDT</span>
      </div>

      <div className={styles.page_hint_text}>{t('address_add_hint_text')}</div>

      <div className={styles.form_wrap}>

        <Form onFinish={onFormFinish} form={form} layout={"vertical"}>

          <Form.Item className={styles.form_item} label={t('collection_input_address_label')} name={'address'} rules={addressRules} required={false}>
            <Input.TextArea className={styles.input_textarea_wrap} />
          </Form.Item>
          <div className={styles.sized_box}></div>
          <Form.Item className={styles.form_item} label={t('collection_input_code_label')} name={'captchaCode'} rules={codeRules} required={false}>
            <InputCodeWidget />
          </Form.Item>


          <Form.Item>
            <Button type={"primary"} htmlType={"submit"} className={styles.update_btn}>{t('collection_join_btn')}</Button>
          </Form.Item>

        </Form>

      </div>

      <div className={styles.last_address_wrap}>
        <div className={styles.box_header}>
          <span className={styles.h_title}>{t('collection_address')}</span>
          <span className={styles.hint_text}>{t('collection_operation')}</span>
        </div>
        <div className={styles.line_wrap}></div>

        {
          addressList.map((item) => (
            <div key={'address-key-' + item.id} className={styles.last_address_item_wrap}>
              <span className={styles.address_text}>{item.address}</span>

              <div className={styles.operation_wrap}>
                <div onClick={() => textCopyToClipboard(item.address)} className={styles.copy_btn}>{t('collection_copy')}</div>
                <div onClick={() => {
                  setAddressDetails(item)
                  setDeleteDialogVis(true)
                }} className={styles.delete_btn}>{t('common_delete')}</div>
              </div>
            </div>
          ))
        }

        {
          loadingStatus !== 2 && (
            <div className={styles.loading_wrapper}><LoadingOutlined id={'moreLoading'} /></div>
          )
        }

      </div>

      <Modal centered footer={null} closeIcon={false} open={deleteDialogVis} onCancel={() => setDeleteDialogVis(false)}>
        <div className={styles.modal_content}>
          <div className={styles.title_wrap}>{t('collection_delete_dialog_text')}</div>

          <div className={styles.modal_btn_wrap}>
            <div onClick={onConfirmDeleteAddress} className={styles.delete_btn}>{t('common_confirm')}</div>
            <div onClick={() => setDeleteDialogVis(false)} className={styles.cancel_btn}>{t('common_cancel')}</div>

          </div>

        </div>
      </Modal>

    </div>
  )
}

export default CollectionPage
