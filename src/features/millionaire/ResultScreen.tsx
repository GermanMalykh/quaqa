import { Game } from './Game'
import '@/styles/millionaire/main.scss'

interface ResultScreenProps {
  game: Game
  isWon: boolean
  onPlayAgain: () => void
}

export default function ResultScreen({ game, isWon, onPlayAgain }: ResultScreenProps) {
  const progress = game.getProgress()

  let finalPrize = 0
  if (isWon) {
    // Победа - получаем миллион!
    finalPrize = progress.score
  } else {
    // Несгораемая сумма при проигрыше
    // Если проиграли на вопросах 1-5, получаем 0
    // Если проиграли на вопросах 6-9, получаем 1000 (первая несгораемая сумма)
    // Если проиграли на вопросах 10-14, получаем 15000 (вторая несгораемая сумма)
    if (progress.currentQuestionIndex < 5) {
      finalPrize = 0
    } else if (progress.currentQuestionIndex < 10) {
      finalPrize = 1000
    } else {
      finalPrize = 15000
    }
  }

  // Форматируем число для отображения с пробелами для разделения тысяч
  const formatPrize = (prize: number): string => {
    return prize.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  }

  return (
    <div className="millionaire-result-content">
      <h2 className={isWon ? 'won' : 'lost'}>
        {isWon ? 'Поздравляем! 🎉' : 'Игра окончена'}
      </h2>
      <p>
        {isWon
          ? '🎉 Поздравляем! Вы выиграли миллион! 🎉'
          : 'К сожалению, вы ответили неправильно.'}
      </p>
      <div className="millionaire-final-score">Ваш выигрыш: {formatPrize(finalPrize)} ₽</div>
      <button onClick={onPlayAgain} className="millionaire-btn millionaire-btn-primary">
        Играть снова
      </button>
    </div>
  )
}

