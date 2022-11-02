import { FormEvent, useState } from 'react'
import Image from 'next/image'

import appPreviewImg from '../assets/nlw_copa_app_preview.png'
import logoImg from '../assets/logo.svg'
import avatarsImg from '../assets/avatars.png'
import iconCheckImg from '../assets/check.svg'
import { api } from '../lib/axios'

interface HomeProps {
  poolCount: number,
  guesseCount: number,
  userCount: number
}

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('')

  async function createPool(event: FormEvent) {
    event.preventDefault()

    try{
      if(poolTitle) {
        const response = await api.post('/pools', {
          title: poolTitle
        })

        const { code } = response.data

        await navigator.clipboard.writeText(code)

        setPoolTitle('')
      }
    }catch(err) {
      console.error("Error:", err)
    }
  }

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 items-center gap-28">
      <main>
        <Image 
          src={logoImg} 
          alt="logo NLW copa" 
        />

        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image 
            src={avatarsImg} 
            alt="dois celulares exibindo uma prévia da aplicação móve do NLW copa" 
          />

          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{props.userCount}</span> pessoas já estão usando
          </strong>
        </div>

        <form 
          className="mt-10 flex gap-2"
          onSubmit={(event) => createPool(event)}
        >
          <input 
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
            type="text" 
            required 
            placeholder="Qual nome do seu bolão?"
            onChange={(event) => setPoolTitle(event.target.value)}
            value={poolTitle}
          />
          <button 
            className="bg-yellow-500 px-6 py-4 rounded font-bold text-gray-900 text-sm uppercase hover:bg-yellow-700"
            type="submit"
          >
            criar meu bolão
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 flex justify-between text-gray-100">
          <div className="flex items-center gap-6">
            <Image 
              src={iconCheckImg} 
              alt="ícone check" 
            />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className='w-px h-14 bg-gray-600' />

          <div className="flex items-center gap-6">
            <Image 
              src={iconCheckImg} 
              alt="ícone check" 
            />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.guesseCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image 
        src={appPreviewImg} 
        alt="dois celulares exibindo uma prévia da aplicação móve do NLW copa" 
      />
    </div>
  )
}

export const  getServerSideProps = async () => {
  const [poolCountResponse, guesseCountResponse, userCountResponse] = await Promise.all([
    api.get('/pools/count'),
    api.get('/guesses/count'),
    api.get('/users/count')
  ])

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guesseCount: guesseCountResponse.data.count,
      userCount: userCountResponse.data.count
    }
  }
}
