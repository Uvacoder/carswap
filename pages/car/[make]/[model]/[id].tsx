import { GetServerSideProps } from 'next';
import { CarModel } from 'database/models/Car';
import { FaRoute, FaGasPump, FaCalendarAlt } from 'react-icons/fa';
import { getCarById, getMakes, getModels } from 'database/api/car';
import Head from 'next/head';
import CarNotFound from 'components/CarNotFound';
import { getAsString } from 'utils';

interface CarDetailsProps {
    car: CarModel | null | undefined;
}

export default function CarDetails({ car }: CarDetailsProps) {
    if (car === null) return <CarNotFound text={'Car not found ...'} />;

    return (
        <>
            <Head>
                <title>{`${car?.make} ${car?.model} (${car?.year})`}</title>
            </Head>

            <div className="container mx-auto m-20 shadow-2xl rounded-md">
                <div className="lg:flex">
                    <div className="w-full md:flex-shrink-0 w-2/3 lg:w-2/3 md:w-full sm:w-full">
                        <img
                            className="rounded-lg md:w-full"
                            src={car?.photoUrl}
                            alt={`${car?.make} ${car?.model} (${car?.year})`}
                        />
                    </div>
                    <div className="p-5">
                        <div className="uppercase tracking-wide text-xl text-black-900 font-bold mb-2">
                            <h1>{`${car?.make} ${car?.model}`}</h1>
                        </div>
                        <span className="text-gray-900 rounded-t-lg font-bold text-xl bg-gray-500 bg-opacity-25 px-1 py-1 mb-2">
                            <span className="text-l">R$</span>{' '}
                            <span className="text-xl">{car?.price}</span>
                        </span>

                        <p className="mt-1 text-gray-600">{car?.details}</p>
                        <div className="flex flex-row mt-6">
                            <div className="flex flex-col pr-5 items-center">
                                <FaGasPump size={28} />
                                <p className="text-gray-900 leading-none py-2">{car?.fuelType}</p>
                            </div>
                            <div className="flex flex-col px-5 items-center">
                                <FaCalendarAlt size={28} />
                                <p className="text-gray-900 leading-none py-2">{car?.year}</p>
                            </div>
                            <div className="flex flex-col px-5 items-center">
                                <FaRoute size={28} />
                                <p className="text-gray-900  leading-none py-2">
                                    {car?.kilometers}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps<CarDetailsProps> = async (context) => {
    const make = getAsString(context.params?.make);
    const model = getAsString(context.params?.model);
    const id = context.params?.id;

    try {
        const [makes, models, car] = await Promise.all([
            getMakes(),
            getModels(make),
            getCarById(id),
        ]);

        const isMakeValid = makes
            .map((make) => make.name.toLowerCase())
            .includes(make.toLowerCase());
        const isModelValid = models
            .map((model) => model.name.toLowerCase())
            .includes(model.toLowerCase());
        const isCarValid = car.make === make && car.model === model;

        if (isMakeValid && isModelValid && isCarValid) return { props: { car } };
    } catch (err) {
        console.log(err);
    }

    return { props: { car: null } };
};