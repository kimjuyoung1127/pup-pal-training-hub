
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input'; // Input 추가
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DogInfo, dogBreeds } from '@/types/dog';

interface Props {
  dogInfo: DogInfo;
  setDogInfo: React.Dispatch<React.SetStateAction<DogInfo>>;
  breedOpen: boolean;
  setBreedOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Step2_DogFeatures: React.FC<Props> = ({ dogInfo, setDogInfo, breedOpen, setBreedOpen }) => {
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
                className="w-full justify-between mt-2 bg-white border-2 border-cream-200 focus:border-orange-300 rounded-xl text-gray-900 hover:bg-cream-50"
              >
                {dogInfo.breed
                  ? dogBreeds.find((breed) => breed === dogInfo.breed)
                  : "견종을 선택해주세요"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 bg-white border-cream-200 shadow-lg z-50">
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
          <Label htmlFor="weight" className="text-gray-800 font-medium">체중 (kg)</Label>
          <Input
            id="weight"
            type="number"
            step="0.1"
            value={dogInfo.weight ?? ''}
            onChange={(e) => {
              const value = e.target.value;
              setDogInfo(prev => ({ ...prev, weight: value === '' ? null : parseFloat(value) }));
            }}
            placeholder="예: 5.2"
            className="mt-2 bg-white border-2 border-cream-200 focus:border-orange-300 rounded-xl text-gray-900"
          />
        </div>
      </div>
    </div>
  );
};

export default Step2_DogFeatures;
