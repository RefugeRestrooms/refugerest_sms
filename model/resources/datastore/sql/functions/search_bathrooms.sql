CREATE OR REPLACE FUNCTION public.search_bathrooms(
      _id integer
    , _latitude numeric
    , _longitude numeric
    , _keywords varchar[]
    , _limit integer
)
RETURNS SETOF public.bathroom
AS $function$

BEGIN

    IF _id IS NOT NULL THEN

        RETURN QUERY
        SELECT *
        FROM public.bathrooms
        WHERE id = _id
        LIMIT _limit;

    ELSIF _latitude IS NOT NULL
    AND _longitude IS NOT NULL THEN

        RETURN QUERY
        SELECT *
        FROM public.bathrooms
        WHERE coordinates <-> POINT(_latitude, _longitude) < 1
        ORDER BY coordinates <-> POINT(_latitude, _longitude)
        LIMIT _limit;

    ELSIF _keywords IS NOT NULL THEN

        RETURN QUERY
        SELECT *
        FROM public.bathrooms
        WHERE name ~* ANY(_keywords)
            OR street ~* ANY(_keywords)
            OR city ~* ANY(_keywords)
            OR state ~* ANY(_keywords)
            OR country ~* ANY(_keywords)
        LIMIT _limit;

    ELSE

        RETURN QUERY
        SELECT *
        FROM public.bathroom
        ORDER BY latitude, longitude, id
        LIMIT _limit;

    END IF;

    RETURN;

END;

$function$