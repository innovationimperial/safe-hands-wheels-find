
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  isSubmitting: boolean;
  isLoading: boolean;
  isValid: boolean;
  isEdit: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({ 
  isSubmitting, 
  isLoading, 
  isValid,
  isEdit
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-end space-x-2">
      <Button
        type="button"
        variant="outline"
        onClick={() => navigate("/admin/vehicles")}
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting || isLoading || !isValid}
      >
        {isSubmitting ? "Saving..." : isEdit ? "Update" : "Create"}
      </Button>
    </div>
  );
};

export default FormActions;
