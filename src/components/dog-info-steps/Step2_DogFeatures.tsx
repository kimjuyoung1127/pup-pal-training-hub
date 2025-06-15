
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
          <Label className="text-cream-800 font-medium">견종</Label>
          <Popover open={breedOpen} onOpenChange={setBreedOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={breedOpen}
                className="w-full justify-between mt-2 bg-white border-2 border-cream-200 focus:border-orange-300 rounded-xl text-cream-800 hover:bg-cream-50"
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
                  className="h-9 text-cream-800"
                />
                <CommandList className="max-h-60 overflow-y-auto">
                  <CommandEmpty className="text-cream-600 py-6 text-center text-sm">
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
                        className="text-cream-800 hover:bg-orange-100 cursor-pointer data-[selected=true]:bg-orange-100"
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
          <Label htmlFor="weight" className="text-cream-800 font-medium">체중</Label>
          <Select onValueChange={(value) => setDogInfo(prev => ({ ...prev, weight: value }))} value={dogInfo.weight || undefined}>
            <SelectTrigger className="mt-2 bg-white border-2 border-cream-200 focus:border-orange-300 rounded-xl text-cream-800">
              <SelectValue placeholder="체중을 선택해주세요" className="text-cream-500" />
            </SelectTrigger>
            <SelectContent className="bg-white border-cream-200 z-50">
              <SelectItem value="small" className="text-cream-800 hover:bg-orange-100 focus:bg-orange-100">소형견 (7kg 미만)</SelectItem>
              <SelectItem value="medium" className="text-cream-800 hover:bg-orange-100 focus:bg-orange-100">중형견 (7kg ~ 25kg)</SelectItem>
              <SelectItem value="large" className="text-cream-800 hover:bg-orange-100 focus:bg-orange-100">대형견 (25kg 이상)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default Step2_DogFeatures;
