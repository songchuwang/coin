
import styles from "./index.module.scss"
import {Button, Form, Input, message, Upload} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import {useState} from "react";
import {BAST_URL} from "@/config/appConfig.ts";
import {getToken} from "@/tools/token.ts";
import {useTranslation} from "react-i18next";
import {APISubmitFeedback} from "@/api";
import useDispatchAction from "@/hooks/useDispatchAction.ts";
import {setLoadingModalVis} from "@/redux/actions/home.ts";
import {useNavigate} from "react-router-dom";
import {jumpHelpLink} from "@/utils/jumpLinkUtils.ts";
import {useSelector} from "react-redux";
import {UserInfoDataType} from "@/redux/reducers/user/userInfo.ts";

const isDev = import.meta.env['VITE_APP_ENV'] === 'development'

const ProblemFeedbackPage = () => {

  const {t}: { t: (key: string, value?: any) => string }  = useTranslation()
  const navigate = useNavigate()

  const dispatch = useDispatchAction({setLoadingModalVis})

  const supportName: string = useSelector((state: any) => state.app.appSetting.supportName)
  const userInfoData: UserInfoDataType = useSelector((state: any) => state.user.userInfo.userInfo)

  const [form] = Form.useForm(null)

  const addressRules: any = [
    // {
    //   required: true,
    //   message: t('collection_input_address_error')
    // },
    {
      validator: (_, value: string) => {
        if (!value || value.trim() === '') {
          return Promise.reject(new Error(t('feedback_please_enter_content')));
        }
        return Promise.resolve();
      }
    }
  ]

  const onFormFinish = (v) => {
    console.log(v)
    dispatch.setLoadingModalVis(true)
    const dataQuery: {msg: string, pics?: string, tgPhone} = {
      ...v,
    }
    APISubmitFeedback(dataQuery).then(resp => {
      if (resp.data) {
        message.success(t('common_operation_successful'))
        navigate(-1)
      } else {
        message.error(resp.msg)
      }
    }).finally(() => {
      dispatch.setLoadingModalVis(false)
    })

  }

  const UploadImgWidget = ({onChange}: {value?: string, onChange?: (v:string) => void}) => {

    const [uploading, setUploading] = useState(false)

    const [imageUrl, setImageUrl] = useState<any>(null)

    const getBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    };

    const uploadChange = async (info) => {
      console.log(info)

      setImageUrl(await getBase64(info.file.originFileObj))
      setUploading(true)
      if (info.file.status === 'done') {
        console.log(info)
        const r_code = info.file.response.code
        if (r_code === 0) {
          onChange?.(info.file.response.data)
        } else {
          message.error(info.file.response.message)
        }
        setUploading(false)
      }
      if (info.file.status === 'error') {
        setUploading(false)
      }
    }

    const beforeUpload = (file) => {
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.warning('< 10M');
      }
      return isLt10M; // 返回 true 才允许上传
    };

    const onClickDelete = () => {
      onChange?.(null)
      setImageUrl(null)
    }

    return (
      <div className={styles.upload_box}>
        <div className={styles.nomore_wrap}>
          <div className={styles.add_icon}></div>
        </div>
        <div className={styles.upload_file_box}>
          <Upload
            accept={'image/png,image/jpeg'}
            name={'file'}
            action={BAST_URL + '/app-api/common/file/upload'}
            headers={{
              "Authorization": `Bearer ${getToken()}`,
              "tenant-id": isDev ? 1 : 6239278
            } as any}
            beforeUpload={beforeUpload}
            onChange={uploadChange}
          >
            <div style={{width: '100%', height: '100%'}}></div>
          </Upload>
        </div>
        {
          imageUrl && (
            <div className={styles.image_show_box}>
              <img src={imageUrl}/>
              <div onClick={onClickDelete} className={styles.delete_icon}></div>
              {
                uploading && <div className={styles.loading_icon}><LoadingOutlined /></div>
              }
            </div>
          )
        }

      </div>
    )
  }


  return (
    <div className={styles.page}>
      <div className={styles.header_wrap}>
        <span>{t('feedback_feedback_column')}</span>
      </div>

      <div className={styles.form_wrap}>

        <Form onFinish={onFormFinish} form={form} layout={"vertical"}>

          <Form.Item className={styles.form_item} label={t('feedback_content_label')} name={'msg'} rules={addressRules} required={true}>
            <Input.TextArea className={styles.input_textarea_wrap} />
          </Form.Item>


          <Form.Item className={styles.form_item} label={'TG Phone'} name={'tgPhone'} rules={addressRules} required={true}>
            <Input className={styles.input_wrap} />
          </Form.Item>

          <div className={styles.sized_box}></div>

          <Form.Item className={styles.form_item} label={t('feedback_upload_voucher')} name={'pics'}>
            <UploadImgWidget />
          </Form.Item>

          <Form.Item>
            <Button type={"primary"} htmlType={"submit"} className={styles.update_btn}>{t('feedback_submit')}</Button>
          </Form.Item>

        </Form>
        {
          userInfoData.rechargeAmount > 0 && (
            <div onClick={() => jumpHelpLink(supportName)} className={styles.help_box_wrap}>
              <div className={styles.help_icon}></div>
              <div className={styles.help_text}>Get Help：@{supportName}</div>
            </div>
          )
        }

      </div>
    </div>
  )
}

export default ProblemFeedbackPage
