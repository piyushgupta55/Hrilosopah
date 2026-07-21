import React from 'react';
import Link from 'next/link';
import { BottomNav } from '@/components/home/BottomNav';
import { Zap, Clock, HelpCircle, Gift, Brain } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function PlayPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('Play');
  const tHome = useTranslations('Home');
  const tCards = useTranslations('Cards');

  return (
    <div
      className="flex-1 w-full bg-[#F8F9FA] pt-4 flex flex-col overflow-y-auto overflow-x-hidden relative"
      style={{ paddingBottom: 'calc(5.5rem + env(safe-area-inset-bottom))' }}
    >
      {/* Header */}
      <div className="px-5 w-full flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{t('title')}</h1>
        <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100">
          <Zap className="w-4 h-4 text-orange-400 fill-orange-400" />
          <span className="text-sm font-bold text-gray-900">3/5</span>
        </div>
      </div>

      {/* Build Up Section */}
      <div className="w-full mb-8">
        <div className="px-5 flex items-center justify-between mb-1">
          <h3 className="font-bold text-gray-900 text-lg">{t('buildUp')}</h3>
          <button className="text-blue-600 text-sm font-semibold hover:text-blue-700">
            {tHome('seeAll')}
          </button>
        </div>
        <p className="px-5 text-gray-500 text-sm mb-4">{t('buildUpSubtitle')}</p>

        <div className="w-full overflow-x-auto no-scrollbar pl-5 pr-5 pb-2">
          <div className="flex items-center gap-4">
            {/* Card 1 */}
            <Link href={`/${locale}/quiz/ai-awareness`}>
              <div className="w-40 h-56 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 p-4 text-white flex flex-col relative overflow-hidden shadow-md shrink-0">
                <div className="bg-white/20 backdrop-blur-md rounded-full px-2.5 py-1 text-[10px] font-bold self-start mb-4">
                  {tCards('level', { num: 1 })}
                </div>
                <Brain
                  className="w-12 h-12 self-center mb-4 mt-2 text-white/90 drop-shadow-sm"
                  strokeWidth={1.5}
                />
                <h4 className="font-bold text-sm leading-tight mt-auto mb-3">
                  {tCards('aiAwareness')}
                </h4>
                <div className="w-full">
                  <div className="flex justify-between items-center text-[10px] font-semibold mb-1.5 text-white/90">
                    <span>8 / 15</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full" style={{ width: '53%' }}></div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Card 2 */}
            <Link href={`/${locale}/quiz/crypto-basics`}>
              <div className="w-40 h-56 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 p-4 text-white flex flex-col relative overflow-hidden shadow-md shrink-0">
                <div className="bg-white/20 backdrop-blur-md rounded-full px-2.5 py-1 text-[10px] font-bold self-start mb-4">
                  {tCards('level', { num: 1 })}
                </div>
                <div className="text-5xl self-center mb-4 mt-2 font-bold opacity-90 drop-shadow-sm">
                  ₿
                </div>
                <h4 className="font-bold text-sm leading-tight mt-auto mb-3">
                  {tCards('cryptoBasics')}
                </h4>
                <div className="w-full">
                  <div className="flex justify-between items-center text-[10px] font-semibold mb-1.5 text-white/90">
                    <span>6 / 15</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Card 3 */}
            <Link href={`/${locale}/quiz/ml-fundamentals`}>
              <div className="w-40 h-56 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 p-4 text-white flex flex-col relative overflow-hidden shadow-md shrink-0">
                <div className="bg-white/20 backdrop-blur-md rounded-full px-2.5 py-1 text-[10px] font-bold self-start mb-4">
                  {tCards('level', { num: 2 })}
                </div>
                <div className="text-5xl self-center mb-4 mt-2 opacity-90 drop-shadow-sm">🤖</div>
                <h4 className="font-bold text-sm leading-tight mt-auto mb-3">
                  {tCards('mlFundamentals')}
                </h4>
                <div className="w-full">
                  <div className="flex justify-between items-center text-[10px] font-semibold mb-1.5 text-white/90">
                    <span>4 / 15</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full" style={{ width: '26%' }}></div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* This or That Section */}
      <div className="px-5 w-full mb-8">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-gray-900 text-lg">{t('thisOrThat')}</h3>
          <button className="text-blue-600 text-sm font-semibold hover:text-blue-700">
            {tHome('seeAll')}
          </button>
        </div>
        <p className="text-gray-500 text-sm mb-4">{t('thisOrThatSubtitle')}</p>

        <div className="flex flex-col gap-3">
          <Link href={`/${locale}/quiz/ai-or-human`}>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-[14px] bg-[#EEF2FF] flex items-center justify-center shrink-0 relative">
                <Brain className="w-7 h-7 text-indigo-600" strokeWidth={1.5} />
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                  <HelpCircle className="w-3 h-3 text-blue-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 text-sm truncate mb-1">
                  {tCards('aiOrHuman')}
                </h4>
                <p className="text-gray-500 text-xs">{tCards('questionsCount', { count: 10 })}</p>
              </div>
            </div>
          </Link>

          <Link href={`/${locale}/quiz/crypto-fact-myth`}>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-[14px] bg-[#E0F2FE] flex items-center justify-center shrink-0 text-2xl font-bold text-[#3B82F6] relative">
                ₿
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                  <HelpCircle className="w-3 h-3 text-[#3B82F6]" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 text-sm truncate mb-1">
                  {tCards('cryptoFactMyth')}
                </h4>
                <p className="text-gray-500 text-xs">{tCards('questionsCount', { count: 10 })}</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Daily Challenge */}
      <div className="px-5 w-full mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 text-lg">{t('dailyChallenge')}</h3>
          <div className="flex items-center gap-1.5 text-blue-600">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-bold">{t('timeLeft', { time: '23h 15m' })}</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#7E57C2] to-[#5E35B1] rounded-xl p-5 text-white shadow-md relative overflow-hidden">
          <div className="absolute -right-4 top-1/2 -translate-y-1/2 opacity-20 text-8xl transform rotate-12 blur-[2px]">
            <Gift className="w-24 h-24" />
          </div>

          <div className="relative z-10">
            <h4 className="font-bold text-lg mb-1">{tCards('blockchainBasicsChallenge')}</h4>
            <p className="text-white/80 text-sm mb-5 pr-12">
              {tCards('blockchainBasicsChallengeDesc')}
            </p>

            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="text-[10px] font-semibold mb-1.5 text-white/90">0 / 10</div>
                <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shrink-0 shadow-sm border border-white/20">
                <span className="text-xl">🎁</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
