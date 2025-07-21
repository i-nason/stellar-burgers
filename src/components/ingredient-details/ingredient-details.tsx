import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import styles from '../app/app.module.css';

interface IngredientDetailsProps {
  isModal?: boolean;
}

export const IngredientDetails: FC<IngredientDetailsProps> = ({ isModal }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { ingredients, isLoading, error } = useSelector(
    (state) => state.ingredients
  );

  useEffect(() => {
    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length]);

  const ingredientData = ingredients.find((item) => item._id === id) || null;

  if (isLoading || !ingredients.length) {
    return <Preloader />;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  if (!ingredientData) {
    return <div style={{ color: 'red' }}>Ингредиент не найден</div>;
  }

  if (isModal) {
    return <IngredientDetailsUI ingredientData={ingredientData} />;
  }

  return (
    <div className={styles.detailPageWrap}>
      <IngredientDetailsUI ingredientData={ingredientData} />
    </div>
  );
};
