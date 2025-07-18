import { useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router';
import logoIconUrl from './assets/logo.svg';
import { Button } from './components/button';
import { FormField } from './components/form-field';
import { Copy } from './icons/copy';
import { Download } from './icons/download';
import { Link as LinkIcon } from './icons/link';
import { Trash } from './icons/trash';

type ShortenedLink = {
  originalLink: string;
  shortLink: string;
  accessCount: number;
};

type Inputs = {
  original_link: string;
  short_link: string;
};

export function App() {
  const [links, setLinks] = useState<ShortenedLink[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = ({ original_link, short_link }) => {
    setLinks(state => [
      ...state,
      {
        originalLink: original_link,
        shortLink: `${window.location.host}/${short_link}`,
        accessCount: 0,
      },
    ]);
  };

  return (
    <div className="flex h-dvh flex-col items-center gap-6 px-3 py-8">
      {/** biome-ignore lint/performance/noImgElement: Not a Next project */}
      <img aria-label="Brev.ly logo" className="h-7" src={logoIconUrl} />

      <div className="flex w-full flex-col gap-3">
        <div className="flex flex-col gap-5 rounded-lg bg-gray-100 p-6">
          <h2 className="font-lg-bold">Novo link</h2>

          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-4">
              <FormField
                errorMessage="Informe uma url válida."
                hasError={!!errors.original_link}
                id="original_link"
                label="Link original"
                placeholder="www.exemplo.com.br"
                type="url"
                {...register('original_link', { required: true })}
              />

              <FormField
                errorMessage="Informe uma url minúscula e sem espaço/caracter especial."
                fixedPlaceholder
                hasError={!!errors.original_link}
                id="short_link"
                label="Link encurtado"
                placeholder="brev.ly/"
                type="text"
                {...register('short_link', { required: true })}
              />
            </div>

            <Button type="submit">Salvar link</Button>
          </form>
        </div>

        <div className="flex flex-col gap-4 rounded-lg bg-gray-100 p-6">
          <header className="flex justify-between">
            <h2 className="font-lg-bold">Meus links</h2>

            <Button disabled={links.length === 0} variant="secondary">
              <Download className="text-gray-600" size={16} />
              Baixar CSV
            </Button>
          </header>

          <main className="flex flex-col items-center justify-center gap-3 border-gray-200 border-t pt-3.5 text-gray-500">
            {links.length > 0 ? (
              links.map(link => (
                <div
                  className="flex w-full items-center justify-between gap-4"
                  key={link.shortLink}
                >
                  <div className="flex flex-auto flex-col overflow-auto">
                    <Link
                      className="truncate font-base-semibold text-blue-base"
                      to={link.shortLink}
                    >
                      {link.shortLink}
                    </Link>
                    <span className="truncate text-sm">
                      {link.originalLink}
                    </span>
                  </div>

                  <span className="text-nowrap text-sm">
                    {link.accessCount}{' '}
                    {link.accessCount === 1 ? 'acesso' : 'acessos'}
                  </span>

                  <div className="flex gap-1">
                    <button
                      className="rounded-sm bg-gray-200 p-2 text-gray-600"
                      type="button"
                    >
                      <Copy size={16} />
                    </button>

                    <button
                      className="rounded-sm bg-gray-200 p-2 text-gray-600"
                      type="button"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <>
                <LinkIcon className="text-gray-400" />
                <span className="font-xs-uppercase">
                  Ainda não existem links cadastrados
                </span>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
