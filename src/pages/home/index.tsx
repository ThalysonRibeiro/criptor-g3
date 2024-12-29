import { FormEvent, useEffect, useState } from 'react'
import { BsSearch } from 'react-icons/bs'
import styles from './home.module.css'
import { Link, useNavigate } from 'react-router-dom'

export interface CoinPros {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  supply: string;
  maxSupply: string;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  priceUsd: string;
  changePercent24Hr: string;
  vwap24Hr: string;
  explorer: string;
  fomatedPrice?: string;
  fomatedMarket?: string;
  fomatedVolume?: string;
}

interface DataPros {
  data: CoinPros[]
}

export function Home() {
  const [input, setImput] = useState("");
  const [coins, setCoins] = useState<CoinPros[]>([]);
  const navGate = useNavigate();
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    getData();
  }, [offset])

  async function getData() {
    fetch(`https://api.coincap.io/v2/assets?limit=10&offset=${offset}`)
      .then(response => response.json())
      .then((data: DataPros) => {
        const coinsData = data.data;

        const price = Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD"
        })
        const priceCompact = Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          notation: "compact"
        })

        const formatedResult = coinsData.map((item) => {
          const fomated = {
            ...item,
            fomatedPrice: price.format(Number(item.priceUsd)),
            fomatedMarket: priceCompact.format(Number(item.marketCapUsd)),
            fomatedVolume: priceCompact.format(Number(item.volumeUsd24Hr)),
          }
          return fomated
        })
        // console.log(formatedResult);
        const listCoins = [...coins, ...formatedResult]
        setCoins(listCoins);


      })
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (input === "") return;
    navGate(`/detail/${input}`)
  }

  function handleGetMore() {
    if (offset === 0) {
      setOffset(10)
      return;
    }
    setOffset(offset + 10)
  }

  return (

    <main className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Digite o nome da moeda... EX BTC'
          value={input}
          onChange={(e) => setImput(e.target.value)}
        />
        <button type='submit'>
          <BsSearch size={30} color='#FFF' />
        </button>
      </form>
      <table>
        <thead>
          <tr>
            <th scope='col'>Moeda</th>
            <th scope='col'>Valor mercado</th>
            <th scope='col'>Preço</th>
            <th scope='col'>Volume</th>
            <th scope='col'>MUdança 24h</th>
          </tr>
        </thead>
        <tbody id='tbody'>

          {coins.length > 0 && coins.map((item) => (
            <tr className={styles.tr} key={item.id}>

              <td className={styles.tdLabel} data-label="Moeda">
                <div className={styles.name}>
                  <img
                    className={styles.logo}
                    alt='Logo cripto'
                    src={`https://assets.coincap.io/assets/icons/${item.symbol.toLocaleLowerCase()}@2x.png`} />
                  <Link to={`/detail/${item.id}`}>
                    <span>{item.name}</span> | {item.symbol}
                  </Link>
                </div>
              </td>

              <td className={styles.tdLabel} data-label="Valor mercado">
                {item.fomatedMarket}
              </td>

              <td className={styles.tdLabel} data-label="Preço">
                {item.fomatedPrice}
              </td>

              <td className={styles.tdLabel} data-label="Volume">
                {item.fomatedVolume}
              </td>

              <td className={styles.tdLoss} data-label="Mudança 24h">
                <span className={
                  Number(item.changePercent24Hr) > 0 ? styles.tdProfit :
                    styles.tdLoss}>{Number(item.changePercent24Hr).toFixed(3)}</span>
              </td>

            </tr>
          ))}
        </tbody>
        <button className={styles.buttonMore} onClick={handleGetMore}>
          Carregar mais
        </button>
      </table>
    </main>

  )
}
