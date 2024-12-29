import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CoinPros } from '../home';
import styles from './detail.module.css'

interface ResponseData {
  data: CoinPros
}
interface ErrorData {
  error: string;
}
type DataPros = ResponseData | ErrorData

export function Detail() {
  const { cripto } = useParams();
  const navgate = useNavigate();
  const [coin, setCoin] = useState<CoinPros>()
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    async function getCoin() {
      try {
        fetch(`https://api.coincap.io/v2/assets/${cripto}`)
          .then(response => response.json())
          .then((data) => {
            if ("error" in data) {
              navgate("/")
              return;
            }

            const price = Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD"
            })
            const priceCompact = Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              notation: "compact"
            })

            const resultData = {
              ...data.data,
              fomatedPrice: price.format(Number(data.data.priceUsd)),
              fomatedMarket: priceCompact.format(Number(data.data.marketCapUsd)),
              fomatedVolume: priceCompact.format(Number(data.data.volumeUsd24Hr)),
            }

            setCoin(resultData);
            setLoading(false);

          })

      } catch (error) {
        console.log(error);
        navgate("/")
      }
    }
    getCoin();
  }, [cripto])

  if (loading || !coin) {
    return (
      <div className={styles.container}>
        <h2 className={styles.center}>Carregando detelhes...</h2>
      </div>
    )
  }

  return (

    <div className={styles.container}>
      <h3 className={styles.center}>{coin?.name}</h3>
      <h3 className={styles.center}>{coin?.symbol}</h3>

      <section className={styles.content}>
        <img
          src={`https://assets.coincap.io/assets/icons/${coin?.symbol.toLocaleLowerCase()}@2x.png`}
          alt='logo da moeda'
          className={styles.logo}
        />
        <h3>{coin?.name} | {coin?.symbol}</h3>
        <p><strong>Preço: </strong>{coin?.fomatedPrice}</p>
        <a>
          <strong>Mercado: </strong>{coin?.fomatedMarket}
        </a>

        <a>
          <strong>Volume: </strong>{coin?.fomatedVolume}
        </a>

        <a>
          <strong>Mudança 24h: </strong><span
            className={Number(coin?.changePercent24Hr) > 0 ? styles.profit : styles.loss}>
            {Number(coin?.changePercent24Hr).toFixed(3)}</span>
        </a>
      </section>
    </div>

  )
}
