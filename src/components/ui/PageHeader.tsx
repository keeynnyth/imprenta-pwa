
import PrimaryButton from "./PrimaryButton";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
}

function PageHeader({
  title,
  subtitle,
  buttonText,
  buttonLink,
}: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-1 text-sm text-slate-500 sm:text-base">
            {subtitle}
          </p>
        )}
      </div>

      {buttonText && buttonLink && (
        <div className="w-full sm:w-auto">
          <PrimaryButton to={buttonLink}>
            {buttonText}
          </PrimaryButton>
        </div>
      )}
    </div>
  );
}

export default PageHeader;