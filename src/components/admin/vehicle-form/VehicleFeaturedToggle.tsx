
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { VehicleFormValues } from '@/schemas/vehicleSchema';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';

interface VehicleFeaturedToggleProps {
  form: UseFormReturn<VehicleFormValues>;
}

const VehicleFeaturedToggle: React.FC<VehicleFeaturedToggleProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="featured"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <FormLabel>Featured Vehicle</FormLabel>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default VehicleFeaturedToggle;
