import React from 'react';

interface Birthday {
  name: string;
  date: string;
  days: number;
  color: string;
}

interface BirthdaysProps {
  birthdays: Birthday[];
  onAddBirthday: () => void;
}

const Birthdays: React.FC<BirthdaysProps> = ({ birthdays, onAddBirthday }) => {
  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center text-xl mr-3">
          🎂
        </div>
        <h2 className="text-xl font-semibold text-white">Birthdays</h2>
      </div>
      
      <div className="space-y-3">
        {birthdays.map((birthday, index) => (
          <div key={index} className="group cursor-pointer">
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-2 h-2 ${birthday.color} rounded-full mr-3`}></div>
                  <div>
                    <div className="text-white font-medium">{birthday.name}</div>
                    <div className="text-white/60 text-sm">{birthday.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white/90 font-semibold text-sm">{birthday.days}</div>
                  <div className="text-white/50 text-xs">
                    {birthday.days === 1 ? 'day' : 'days'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button 
        onClick={onAddBirthday}
        className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-xl text-white font-medium hover:from-white/20 hover:to-white/10 transition-all duration-300"
      >
        <span className="mr-2">+</span> Add Birthday
      </button>
    </div>
  );
};

export default Birthdays;
