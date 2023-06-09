import React from 'react'
import { useTranslation } from 'next-i18next'
import { Col, Row } from '../../shared/layout/flex'
import Image from 'next/image'
import { logo } from '../../../../public/assets/images/svg'
import Link from 'next/link'
import { footerLinks, socials } from '../../../utils/constants/footer'
import { EmailIcon } from '../../svg/SocialIcons'
import _ from 'lodash'

const Footer = () => {
  const { t } = useTranslation(["common"]);

  return (
    <div className='bg-grey-2 py-5 w-full lg:h-96 mt-4'>
      <div className='flex flex-col lg:flex-row container lg:pt-12 gap-14 justify-between'>
        <Col className='gap-6 lg:w-3/12'>
          <Image src={logo} alt='arya-footer-logo' className='w-40' />
          <p className="text-grey-1 text-xs font-medium">{t("footerdesc")}</p>
          <Row className='gap-5 items-center'>
            {socials.map((social) => {
              return <Link key={_.uniqueId()} href={social.link}>
                <social.logo className='w-4 h-4 fill-current text-white' />
              </Link>
            })}
          </Row>
        </Col>
        <div className='grid grid-cols-2 gap-4 md:gap-0 md:flex w-full items-start justify-between'>
          {
            footerLinks.map((section) => {
              return <Col key={_.uniqueId()} className='gap-4'>
                <h3 className='text-white text-base font-medium'>{section.name}</h3>
                <Col className='gap-3'>
                  {section.links.map((link) => {
                    return <Link key={_.uniqueId()} className='text-grey-1 hover:text-white' href={link.route}>{link.name}</Link>
                  })}
                </Col>
              </Col>
            })
          }
          <Col className='gap-4'>
            <h3 className='text-white text-base font-medium'>Contact</h3>
            <Row className='gap-3'>
              <Row>
                <Link href={'mailto:support@aryatrading.com'}><EmailIcon className='w-4 h-4 fill-current text-white' /></Link>
              </Row>
              <Link className='text-grey-1 text-sm font-medium' href={'mailto:support@aryatrading.com'}>support@aryatrading.com</Link>
            </Row>
          </Col>
        </div>

      </div>
    </div>
  )
}

export default Footer;
