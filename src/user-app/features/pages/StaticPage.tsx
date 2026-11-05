import React from 'react'
import { Link, useParams } from 'react-router-dom'
import NotFoundPage from './NotFoundPage'

type StaticContent = { title: string; body: React.ReactNode }

// TODO(content): replace with the real Privacy Policy text (or load it from the CMS/API once one exists).
const PAGES: Record<string, StaticContent> = {
  'privacy-policy': {
    title: 'Privacy & Policy',
    body: (
      <>
        We respect your privacy and only use your details to run your account. For the full terms that apply to
        using this site, see the{' '}
        <Link to='/terms-conditions' className='tw-text-link tw-underline'>
          Terms &amp; Conditions
        </Link>{' '}
        and{' '}
        <Link to='/responsible-gaming' className='tw-text-link tw-underline'>
          Responsible Gaming
        </Link>{' '}
        pages.
      </>
    ),
  },
}

/** /page/:slug (v2 §5.10): on the page background, no card. */
const StaticPage = () => {
  const { slug = '' } = useParams()
  const page = PAGES[slug]
  if (!page) return <NotFoundPage />
  return (
    <article className='ua-ui tw-px-2 tw-py-4'>
      <h1 className='tw-mb-3 tw-text-[24px] tw-font-bold'>{page.title}</h1>
      <p className='tw-m-0 tw-text-[15px] tw-leading-relaxed'>{page.body}</p>
    </article>
  )
}

export default StaticPage
