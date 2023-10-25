import Button from '@/components/ui/buttons/Button';

function AddYoutubeLinkButton({ disabled, onClick }) {
  return (
    <Button
      type="button_string"
      className="m-top-5 m-left-auto c-blue"
      text="+ Add new field"
      disabled={disabled}
      onClick={onClick}
    />
  );
}

export default AddYoutubeLinkButton;
