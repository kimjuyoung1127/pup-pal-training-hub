import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DogInfo, dogBreeds, breedData } from '@/types/dog';

interface Props {
  dogInfo: DogInfo;
  setDogInfo: React.Dispatch<React.SetStateAction<DogInfo>>;
  breedOpen: boolean;
  setBreedOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Step2_DogFeatures: React.FC<Props> = ({ dogInfo, setDogInfo, breedOpen, setBreedOpen }) => {
  // Always include 0kg as minimum, and set a reasonable maximum based on breed
  const [weightRange, setWeightRange] = useState<[number, number]>([0, 30]);
  const [showWeightInput, setShowWeightInput] = useState(false);

  // Update weight range based on breed, but always keep 0 as minimum
  useEffect(() => {
    if (dogInfo.breed && breedData[dogInfo.breed]) {
      const breedInfo = breedData[dogInfo.breed];
      // Get adult weight range as reference, but adjust for puppies
      const adultRange = breedInfo.idealWeight.adult.male;
      // Set max to adult weight + 20kg to accommodate growth and large breeds
      setWeightRange([0, Math.max(30, adultRange[1] + 20)]);
    } else {
      // Default range - always start at 0 for puppies
      setWeightRange([0, 30]);
    }
  }, [dogInfo.breed]);

  // Handle weight slider change
  const handleWeightChange = (value: number) => {
    setDogInfo(prev => ({ ...prev, weight: value }));
  };

  // Handle manual input change
  const handleManualInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDogInfo(prev => ({ ...prev, weight: value === '' ? null : parseFloat(value) }));
  };

  // Toggle between slider and manual input
  const toggleWeightInput = () => {
    setShowWeightInput(!showWeightInput);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">📏</div>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-gray-800 font-medium">견종</Label>
          <Popover open={breedOpen} onOpenChange={setBreedOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={breedOpen}
                className="w-full justify-between mt-2 bg-white border-2 border-sky-200 focus:border-sky-300 rounded-xl text-gray-900 hover:bg-sky-50"
              >
                {dogInfo.breed
                  ? dogBreeds.find((breed) => breed === dogInfo.breed)
                  : "견종을 선택해주세요"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 bg-white border-sky-200 shadow-lg z-50">
              <Command className="bg-white">
                <CommandInput 
                  placeholder="견종을 검색해보세요..." 
                  className="h-9 text-gray-900"
                />
                <CommandList className="max-h-60 overflow-y-auto">
                  <CommandEmpty className="text-gray-600 py-6 text-center text-sm">
                    검색 결과가 없습니다.
                  </CommandEmpty>
                  <CommandGroup>
                    {dogBreeds.map((breed) => (
                      <CommandItem
                        key={breed}
                        value={breed}
                        onSelect={(currentValue) => {
                          setDogInfo(prev => ({ ...prev, breed: currentValue === dogInfo.breed ? "" : currentValue }));
                          setBreedOpen(false);
                        }}
                        className="text-gray-800 hover:bg-sky-100 cursor-pointer data-[selected=true]:bg-sky-100"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            dogInfo.breed === breed ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {breed}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="weight" className="text-gray-800 font-medium">체중 (kg)</Label>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleWeightInput}
              className="text-sky-600 hover:text-sky-800 text-xs"
            >
              {showWeightInput ? "슬라이더로 입력" : "직접 입력"}
            </Button>
          </div>
          
          {showWeightInput ? (
            <Input
              id="weight"
              type="number"
              step="0.1"
              min="0"
              value={dogInfo.weight ?? ''}
              onChange={handleManualInputChange}
              placeholder="예: 5.2"
              className="mt-2 bg-white border-2 border-sky-200 focus:border-sky-300 rounded-xl text-gray-900"
            />
          ) : (
            <div className="space-y-4">
              <div className="relative pt-1">
                <input
                  type="range"
                  min={weightRange[0]}
                  max={weightRange[1]}
                  step="0.1"
                  value={dogInfo.weight ?? 0}
                  onChange={(e) => handleWeightChange(parseFloat(e.target.value))}
                  className="w-full h-2 bg-sky-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{weightRange[0]}kg</span>
                  <span>{weightRange[1]}kg</span>
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                <div className="bg-sky-100 rounded-full w-24 h-24 flex items-center justify-center">
                  <span className="text-2xl font-bold text-sky-800">
                    {dogInfo.weight !== null ? dogInfo.weight.toFixed(1) : '0.0'}kg
                  </span>
                </div>
              </div>
              
              <div className="text-center text-xs text-gray-600 mt-2">
                {dogInfo.breed && breedData[dogInfo.breed] ? (
                  (() => {
                    const breedInfo = breedData[dogInfo.breed];
                    const adultRange = breedInfo.idealWeight.adult.male;
                    return `참고: ${dogInfo.breed}의 성견 적정 체중은 ${adultRange[0]}~${adultRange[1]}kg 입니다 (어린 강아지는 이보다 작을 수 있습니다)`;
                  })()
                ) : (
                  "어린 강아지의 경우 몇 주간 급격히 체중이 증가할 수 있습니다"
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step2_DogFeatures;