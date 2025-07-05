import styles from "./index.module.scss"
import {useTranslation} from "react-i18next";
import {Form, Input, message} from "antd";
import {useState} from "react";
import useDispatchAction from "@/hooks/useDispatchAction.ts";
import {setLoadingModalVis} from "@/redux/actions/home.ts";
import {APINodeApply} from "@/api";
import {NodeApplyReqType} from "@/types";
import {useNavigate} from "react-router-dom";

const NodeApplyForm = () => {

  const {t}: { t: (key: string, value?: any) => string }  = useTranslation()

  const dispatch = useDispatchAction({ setLoadingModalVis })

  const navigate = useNavigate()

  const [form] = Form.useForm(null)

  const [chooseApplyType, setChooseApplyType] = useState(1)

  const [errorChooseApplyType] = useState<any>(null)


  const gotoNodeList = () => {
    // navigate('/nodeList')
    form.submit()
  }

  const onFormFinish = (v) => {
    dispatch.setLoadingModalVis(true)
    const applyData: NodeApplyReqType = {
      name: v.name,
      manifesto: v.manifesto,
      link: v.link,
      type: chooseApplyType
    }
    APINodeApply(applyData).then(resp => {
      if (resp.code === 0) {
        message.success(t('common_operation_successful'))
        navigate('/nodeApplyPage', {replace: true})
      } else {
        message.error(resp.msg)
      }
    }).finally(() => {
      dispatch.setLoadingModalVis(false)
    })
  }

  const onSetApplyType = (type: number) => {
    if (type === 2) {
      // message.info(t('upgrade_text'))
    } else {
      setChooseApplyType(type)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header_wrap}>
        <span>{t('node_apply')}</span>
      </div>

      <div className={styles.content_wrap}>

        <Form form={form} layout={"vertical"} onFinish={onFormFinish}>
          <div className={styles.title_wrap}>{t('node_form_apply_for_nodes')}</div>
          <div className={styles.form_content_wrap}>

            <Form.Item className={styles.form_item_sty} label={t('node_form_name')} name={'name'} required={false} rules={[{required: true, message: t('node_form_name_error_text')}]}>
              <Input className={styles.text_input_wrap} placeholder={t('node_form_name_placeholder')} />
            </Form.Item>

            <Form.Item className={styles.form_item_sty} label={t('node_form_manifest')} name={'manifesto'} required={false} rules={[{required: true, message: t('node_form_manifest_error_text')}]}>
              <Input.TextArea className={styles.textarea_input_wrap} placeholder={t('node_form_manifest_placeholder')} />
            </Form.Item>

            <Form.Item className={styles.form_item_sty} label={t('node_form_link')} name={'link'} required={false} rules={[{required: true, message: t('node_form_link_error_text')}]}>
              <Input className={styles.text_input_wrap} placeholder={t('node_form_link_placeholder')} />
            </Form.Item>

          </div>
          <div className={styles.title_wrap}>{t('node_form_choose_how_to_apply')}</div>
          <div className={styles.form_content_wrap}>
            <div className={styles.switch_wrap}>
              <div className={styles.switch_label_wrap}>{t('node_form_normal_node')}</div>
              <div onClick={() => onSetApplyType(1)} className={`${styles.switch_content_wrap} ${chooseApplyType === 1 && styles.switch_content_wrap_selected} ${errorChooseApplyType === 1 && styles.switch_content_wrap_error}`}><span>{t('node_form_push_people', {amount: 30})}</span></div>
            </div>
            <div className={styles.switch_wrap}>
              <div className={styles.switch_label_wrap}>{t('node_form_super_node')}</div>
              <div onClick={() => onSetApplyType(2)} className={`${styles.switch_content_wrap} ${styles.switch_content_wrap_gay} ${chooseApplyType === 2 && styles.switch_content_wrap_selected} ${errorChooseApplyType === 2 && styles.switch_content_wrap_error}`}><span>{t('node_form_freeze', {amount: 2000})}</span></div>
            </div>
          </div>

        </Form>

      </div>

      <div className={styles.sized_box}></div>

      <div className={styles.bottom_wrap}>
        {/*<div className={styles.error_text}>*not meet</div>*/}
        <div onClick={gotoNodeList} className={styles.submit_btn}><span>{t('common_submit')}</span></div>
      </div>

    </div>
  )
}

export default NodeApplyForm
