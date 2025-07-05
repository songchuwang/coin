
import styles from "./index.module.scss"
import ImageWidget from "@/components/ImageWidget";
import {Button, Form, Input, message} from "antd";
import {useTranslation} from "react-i18next";
import {UserInfoDataType} from "@/redux/reducers/user/userInfo.ts";
import {useSelector} from "react-redux";
import {useEffect} from "react";
import useDispatchAction from "@/hooks/useDispatchAction.ts";
import {setLoadingModalVis, setUserInfoData} from "@/redux/actions/home.ts";
import {APIUpdateUserInfo, APIUserInfo} from "@/api";
import {UpdateUserInfoReqType} from "@/types";

const UpdateAccount = () => {

  const {t}: { t: (key: string, value?: any) => string }  = useTranslation()

  const dispatch = useDispatchAction({ setLoadingModalVis, setUserInfoData })

  const [form] = Form.useForm(null)

  const userInfoData: UserInfoDataType = useSelector((state: any) => state.user.userInfo.userInfo)

  const emailRules: any = [
    {
      required: false,
      message: t('account_email_error')
    },
    {
      required: false,
      type: 'email',
      message: t('account_email_error1'),
    },
  ]

  const nameRules: any = [
    {
      required: false,
      message: t('account_name_error')
    },
  ]

  const onFormFinish = (v) => {
    dispatch.setLoadingModalVis(true)
    const reqData: UpdateUserInfoReqType = {
      ...v,
      userId: userInfoData.userId
    }
    APIUpdateUserInfo(reqData).then(resp => {
      if (resp.code === 0) {
        return APIUserInfo()
      } else {
        message.error(resp.msg)
      }
    }).then(resp => {
      if (resp && resp.code === 0) {
        message.success(t('common_operation_successful'))
        dispatch.setUserInfoData(resp.data)
      }
    }).finally(() => {
      dispatch.setLoadingModalVis(false)
    })
  }

  useEffect(() => {
    form.setFieldsValue({
      email: userInfoData.email,
      nickName: userInfoData.nickName
    })
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.header_wrap}>
        <span>{t('account_update_account')}</span>
      </div>

      <div className={styles.head_wrap}>
        <div className={styles.head_img}>
          <ImageWidget src={userInfoData.avatar === '' ? './img/default_avatar.png' : userInfoData.avatar} />
        </div>
      </div>

      <div className={styles.form_wrap}>
        <Form onFinish={onFormFinish} form={form} layout={"vertical"}>

          <Form.Item className={styles.form_item} required={false} rules={emailRules} label={t('account_email')} name={'email'}>
            <Input className={styles.input_wrap} />
          </Form.Item>
          <div className={styles.sized_box}></div>
          <Form.Item className={styles.form_item} required={false} rules={nameRules} label={t('account_name')} name={'nickName'}>
            <Input className={styles.input_wrap} />
          </Form.Item>


          <Form.Item>
            <Button type={"primary"} htmlType={"submit"} className={styles.update_btn}>{t('account_update')}</Button>
          </Form.Item>

        </Form>
      </div>

    </div>
  )
}

export default UpdateAccount
